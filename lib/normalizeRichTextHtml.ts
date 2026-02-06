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
  return html
    .replace(/<p>\s*<\/p>/gi, "<p>&nbsp;</p>")
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, "<p>&nbsp;</p>");
}
