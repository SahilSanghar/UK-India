/**
 * TipTap (and other editors) often store "blank lines" as empty paragraphs
 * like `<p></p>` or `<p><br></p>`.
 *
 * When rendered, those can collapse (especially if your CSS resets margins),
 * making it look like there is no visual break between paragraphs.
 *
 * This normalizes those empty paragraphs to contain `&nbsp;` so they occupy
 * vertical space consistently.
 */
export function normalizeRichTextHtml(html: string | null | undefined): string {
  if (!html) return "";

  // Normalize common "empty paragraph" variants.
  // - `<p></p>`
  // - `<p>   </p>`
  // - `<p><br></p>` / `<p><br /></p>`
  //
  // Note: We intentionally keep it conservative and only touch paragraphs that
  // are otherwise empty.
  let normalized = html
    .replace(/<p>\s*<\/p>/gi, "<p>&nbsp;</p>")
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "<p>&nbsp;</p>");

  // Use only one color for <a> tags
  const aColor = "#012d6b"; // Only blue

  normalized = normalized.replace(/<a\b([^>]*)>/gi, function (match: string, attrs: string) {
    // Check if style already present
    const styleMatch = attrs.match(/style=('|")([^'"]*)\1/);
    if (styleMatch) {
      // Append color style to existing style attribute
      return `<a${attrs.replace(
        /style=('|")([^'"]*)\1/,
        `style="$2; color: ${aColor};"`
      )}>`;
    } else {
      // No style attribute, inject one
      return `<a${attrs} style="color: ${aColor};">`;
    }
  });

  return normalized;
}
