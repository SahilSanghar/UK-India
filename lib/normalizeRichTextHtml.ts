/**
 * TipTap (and other editors) often store "blank lines" as empty paragraphs
 * like `<p></p>` or `<p><br></p>`, and also as empty list items like `<li></li>` or `<li><br></li>`.
 *
 * When rendered, those can collapse (especially if your CSS resets margins),
 * making it look like there is no visual break between paragraphs or list items.
 *
 * This normalizes those empty paragraphs and list items to contain `&nbsp;` so they occupy
 * vertical space consistently.
 */
function injectStyle(tag: string, attrs: string, style: string): string {
  const styleMatch = attrs.match(/style=('|")([^'"]*)\1/);
  if (styleMatch) {
    return `<${tag}${attrs.replace(
      /style=('|")([^'"]*)\1/,
      `style="$2; ${style}"`
    )}>`;
  }
  return `<${tag}${attrs} style="${style}">`;
}

export function normalizeRichTextHtml(html: string | null | undefined): string {
  if (!html) return "";

  // Normalize common "empty paragraph" and "empty li" variants.
  // - `<p></p>`
  // - `<p>   </p>`
  // - `<p><br></p>` / `<p><br /></p>`
  // - `<li></li>`
  // - `<li>   </li>`
  // - `<li><br></li>` / `<li><br /></li>`
  //
  // Note: We intentionally keep it conservative and only touch elements that
  // are otherwise empty.
  let normalized = html
    .replace(/<p>\s*<\/p>/gi, "<p>&nbsp;</p>")
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "<p>&nbsp;</p>")
    .replace(/<li>\s*<\/li>/gi, "<li>&nbsp;</li>")
    .replace(/<li>\s*<br\s*\/?>\s*<\/li>/gi, "<li>&nbsp;</li>");

  // TipTap wraps li content in <p> tags which are block-level and push text
  // below the bullet marker. Strip those inner <p> wrappers.
  normalized = normalized
    .replace(/<li([^>]*)>\s*<p[^>]*>/gi, "<li$1>")
    .replace(/<\/p>\s*<\/li>/gi, "</li>");

  // Restore list styling stripped by Tailwind's preflight reset
  normalized = normalized
    .replace(/<ul\b([^>]*)>/gi, function (_match: string, attrs: string) {
      const style = "list-style-type: disc; list-style-position: inside; padding-left: 0; margin-bottom: 1rem; text-align: left;";
      return injectStyle("ul", attrs, style);
    })
    .replace(/<ol\b([^>]*)>/gi, function (_match: string, attrs: string) {
      const style = "list-style-type: decimal; list-style-position: inside; padding-left: 0; margin-bottom: 1rem; text-align: left;";
      return injectStyle("ol", attrs, style);
    })
    .replace(/<li\b([^>]*)>/gi, function (_match: string, attrs: string) {
      const style = "margin-bottom: 0.5rem; padding-left: 0.25rem; text-align: left;";
      return injectStyle("li", attrs, style);
    });

  // Use only one color for <a> tags
  const aColor = "#012d6b"; // Only blue

  normalized = normalized.replace(/<a\b([^>]*)>/gi, function (_match: string, attrs: string) {
    return injectStyle("a", attrs, `color: ${aColor};`);
  });

  return normalized;
}
