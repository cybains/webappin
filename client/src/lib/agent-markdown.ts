import { parseDocument, DomUtils } from "htmlparser2";

type Node = ReturnType<typeof parseDocument>["children"][number];
const escapeText = (value: string) => value.replace(/\\/g, "\\\\").replace(/([`*_[\]<>])/g, "\\$1").replace(/(^|\n)([ \t]*)([#>+-]|\d+\.)/g, "$1$2\\$3");

// Parse inert HTML; never execute scripts or include submitted form values.
export function pageMarkdown(html: string, canonical: string) {
  const document = parseDocument(html);
  const main = DomUtils.findOne(node => node.name === "main", document.children)
    ?? DomUtils.findOne(node => "data-page-content" in node.attribs, document.children);
  if (!main) throw new Error("Public page has no main content");
  function render(node: Node): string {
    if (node.type === "text") return escapeText(node.data.replace(/\s+/g, " "));
    if (!DomUtils.isTag(node)) return "";
    const { name, attribs, children } = node;
    if (["script", "style", "svg", "nav", "footer", "form", "button", "input", "select", "textarea", "template", "noscript"].includes(name) || "hidden" in attribs || attribs["aria-hidden"] === "true") return "";
    const content = children.map(render).join("");
    if (/^h[1-6]$/.test(name)) return `\n\n${"#".repeat(Number(name[1]))} ${content.trim()}\n\n`;
    if (name === "br") return "\n";
    if (name === "span" && attribs.class?.split(/\s+/).includes("block")) return ` ${content}`;
    if (name === "hr") return "\n\n---\n\n";
    if (name === "a" && attribs.href) {
      try {
        const url = new URL(attribs.href, canonical);
        if (["https:", "http:", "mailto:", "tel:"].includes(url.protocol)) return `[${content.trim()}](<${url.href.replace(/>/g, "%3E")}>)`;
      } catch { /* Keep the visible label when a link is malformed. */ }
    }
    if (["strong", "b"].includes(name)) return `**${content.trim()}**`;
    if (["em", "i"].includes(name)) return `*${content.trim()}*`;
    if (name === "pre") return `\n\n\`\`\`\`\n${DomUtils.textContent(node)}\n\`\`\`\`\n\n`;
    if (name === "code") return `\`\`${DomUtils.textContent(node).replace(/`/g, "'")}\`\``;
    if (name === "li") {
      const siblings = node.parent && "children" in node.parent ? node.parent.children.filter(child => DomUtils.isTag(child) && child.name === "li") : [];
      const marker = node.parent && DomUtils.isTag(node.parent) && node.parent.name === "ol" ? `${siblings.indexOf(node) + 1}.` : "-";
      return `\n${marker} ${content.trim().replace(/\n/g, "\n  ")}\n`;
    }
    if (name === "tr") return `\n${children.filter(DomUtils.isTag).map(cell => cell.children.map(render).join("").trim()).join(" | ")}\n`;
    if (["p", "section", "article", "header", "div", "ul", "ol", "table", "details", "summary", "dl", "dt", "dd", "blockquote"].includes(name)) return `\n\n${content.trim()}\n\n`;
    return content;
  }
  const content = render(main).replace(/\n[ \t]+\n/g, "\n\n").replace(/\n{3,}/g, "\n\n").trim();
  if (content.length < 20) throw new Error("Public page has insufficient readable content");
  return `${content}\n\n---\n\nSource: ${canonical}\n\n[Contact Sufoniq](mailto:support@sufoniq.com) · [Agent guidance](https://sufoniq.com/llms.txt) · [Sitemap](https://sufoniq.com/sitemap.xml)\n`;
}

export const missingPageMarkdown = "# Page not found\n\nThe requested Sufoniq page does not exist. Use the [site guide](https://sufoniq.com/llms.txt) or [sitemap](https://sufoniq.com/sitemap.xml) to find a current page.\n";
