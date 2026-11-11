// Split HTTP lists without interpreting separators inside quoted parameters.
function split(value: string, separator: string) {
  const parts: string[] = [];
  let start = 0, quoted = false, escaped = false;
  for (let i = 0; i < value.length; i++) {
    if (escaped) { escaped = false; continue; }
    if (quoted && value[i] === "\\") { escaped = true; continue; }
    if (value[i] === '"') quoted = !quoted;
    if (!quoted && value[i] === separator) { parts.push(value.slice(start, i)); start = i + 1; }
  }
  parts.push(value.slice(start));
  return parts;
}

// RFC 9110: first find each representation's most specific matching range,
// then compare its quality. A wildcard must not override an exact q=0.
export function representation(accept: string | null) {
  const ranges = split(accept ?? "*/*", ",").map((entry, order) => {
    const [media, ...parameters] = split(entry, ";").map(value => value.trim());
    let q = 1, parameterCount = 0, compatible = true, afterQuality = false;
    for (const parameter of parameters) {
      const equals = parameter.indexOf("=");
      const name = parameter.slice(0, equals).trim().toLowerCase();
      const value = parameter.slice(equals + 1).trim().replace(/^"|"$/g, "");
      if (name === "q") {
        q = /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(value) ? Number(value) : 0;
        afterQuality = true;
      } else if (!afterQuality) {
        parameterCount++;
        if (name !== "charset" || value.toLowerCase() !== "utf-8") compatible = false;
      }
    }
    return { media: media.toLowerCase(), q, parameterCount, compatible, order };
  });
  const candidates = ["text/html", "text/markdown"].map((type, serverOrder) => {
    const matches = ranges.filter(range => range.compatible && [type, "text/*", "*/*"].includes(range.media))
      .map(range => ({ ...range, specificity: range.media === type ? 2 : range.media === "text/*" ? 1 : 0 }))
      .sort((a, b) => b.specificity - a.specificity || b.parameterCount - a.parameterCount || b.q - a.q || a.order - b.order);
    return { type, serverOrder, ...matches[0] };
  }).filter(candidate => candidate.q > 0)
    .sort((a, b) => b.q - a.q || b.specificity - a.specificity || b.parameterCount - a.parameterCount || a.order - b.order || a.serverOrder - b.serverOrder);
  return candidates[0]?.type;
}

export function appendVary(current: string | null, value: string) {
  const values = (current ?? "").split(",").map(v => v.trim()).filter(Boolean);
  if (!values.some(v => v.toLowerCase() === value.toLowerCase())) values.push(value);
  return values.join(", ");
}
