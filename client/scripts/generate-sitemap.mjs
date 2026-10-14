import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const app = path.join(root, "src/app");
const excluded = new Set(["/country", "/maptest", "/growth-atlas", "/api", "/jobs"]);
const entries = new Map();
const dateCache = new Map();

function sourceDate(file) {
  if (dateCache.has(file)) return dateCache.get(file);
  let date;
  try {
    // File checkout times and deployment dates are not content modification dates.
    // Uncommitted files have no reliable published date, so omit it.
    const status = execFileSync("git", ["status", "--porcelain", "--", file], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
    if (!status.trim()) {
      const value = execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
      if (value && !Number.isNaN(Date.parse(value))) date = new Date(value).toISOString();
    }
  } catch {
    // Some deployment environments do not include Git history.
  }
  dateCache.set(file, date);
  return date;
}

function resolveImport(specifier, file) {
  const base = specifier.startsWith("@/")
    ? path.join(root, "src", specifier.slice(2))
    : specifier.startsWith(".") ? path.resolve(path.dirname(file), specifier) : null;
  if (!base) return null;
  return [base, ...[".tsx", ".ts", ".jsx", ".js", ".json"].map(ext => base + ext), ...["index.tsx", "index.ts", "index.js"].map(name => path.join(base, name))]
    .find(candidate => existsSync(candidate) && statSync(candidate).isFile());
}

function dependencies(file, seen = new Set()) {
  if (seen.has(file)) return seen;
  seen.add(file);
  if (!/\.[jt]sx?$/.test(file)) return seen;
  for (const imported of ts.preProcessFile(readFileSync(file, "utf8"), true, true).importedFiles) {
    const resolved = resolveImport(imported.fileName, file);
    if (resolved) dependencies(resolved, seen);
  }
  return seen;
}

function lastModified(files) {
  const dates = [...files].map(sourceDate);
  // Avoid claiming an old timestamp when any source has no reliable date.
  if (dates.some(date => !date)) return undefined;
  return dates.sort().at(-1);
}

function walk(directory, segments = []) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    if (!item.isDirectory() || item.name.startsWith("_") || item.name.startsWith("@")) continue;
    // Dynamic routes are added from their content registry below.
    if (item.name.includes("[")) continue;
    const next = item.name.startsWith("(") ? segments : [...segments, item.name];
    const url = "/" + next.join("/");
    if ([...excluded].some(prefix => url === prefix || url.startsWith(prefix + "/"))) continue;
    walk(path.join(directory, item.name), next);
  }
  const page = ["page.tsx", "page.ts", "page.jsx", "page.js"].map(name => path.join(directory, name)).find(existsSync);
  if (page) {
    const sources = dependencies(page);
    // Include ancestor metadata layouts when computing content modification dates.
    let parent = directory;
    while (parent.startsWith(app)) {
      const layout = path.join(parent, "layout.tsx");
      if (existsSync(layout)) for (const file of dependencies(layout)) sources.add(file);
      if (parent === app) break;
      parent = path.dirname(parent);
    }
    entries.set("/" + segments.join("/"), { path: "/" + segments.join("/"), lastModified: lastModified(sources) });
  }
}

walk(app);

// Read the existing TypeScript content registry without evaluating site code.
const contentFile = path.join(root, "src/lib/insights/content.ts");
const content = readFileSync(contentFile, "utf8");
function articlesFrom(text) {
 const source = ts.createSourceFile(contentFile, text, ts.ScriptTarget.Latest, true);
 const articles = new Map();
 function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(source) === "insightPages" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
    for (const article of node.initializer.elements) {
      if (!ts.isObjectLiteralExpression(article)) continue;
      const slug = article.properties.find(property => ts.isPropertyAssignment(property) && property.name.getText(source) === "slug");
      if (!slug || !ts.isStringLiteral(slug.initializer)) continue;
      articles.set(slug.initializer.text, article.getText(source));
    }
  }
  ts.forEachChild(node, visit);
 }
 visit(source);
 return articles;
}
const articles = articlesFrom(content);
const articleDates = new Map();
try {
  if (sourceDate(contentFile)) {
    const repository = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: root, encoding: "utf8" }).trim();
    const relative = path.relative(repository, contentFile).split(path.sep).join("/");
    const history = execFileSync("git", ["log", "--format=%H %cI", "--", contentFile], { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }).trim().split("\n");
    const active = new Set(articles.keys());
    for (const line of history) {
      const [hash, date] = line.trim().split(" ");
      const previous = articlesFrom(execFileSync("git", ["show", `${hash}:${relative}`], { cwd: root, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 }));
      for (const slug of active) {
        if (previous.get(slug) === articles.get(slug)) articleDates.set(slug, new Date(date).toISOString());
        else active.delete(slug);
      }
      if (!active.size) break;
    }
  }
} catch {
  // Missing or shallow history must never prevent deployment.
}
const template = dependencies(path.join(app, "insights/[...slug]/page.tsx"));
template.delete(contentFile);
const templateDate = lastModified(template);
for (const slug of articles.keys()) {
  const url = `/insights/${slug}`;
  const articleDate = articleDates.get(slug);
  const lastModified = articleDate && templateDate ? [articleDate, templateDate].sort().at(-1) : undefined;
  // A dedicated page (such as /insights/growth) takes precedence.
  if (!entries.has(url)) entries.set(url, { path: url, lastModified });
}

const output = path.join(root, "src/generated/sitemap.json");
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify([...entries.values()].sort((a, b) => a.path.localeCompare(b.path)), null, 2) + "\n");
console.log(`Generated sitemap with ${entries.size} public pages.`);
