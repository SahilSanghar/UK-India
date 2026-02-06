const BASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export function generateKeyBetween(left: string | null, right: string | null): string {
  // 1. Initial State: If the list is empty
  if (!left && !right) return "V";

  const l = left || "";
  const r = right || "{"; // '{' sorts after 'z'

  let result = "";
  let i = 0;

  while (true) {
    const charL = l[i] || "A"; // Use 'A' as the floor
    const charR = r[i] || "{"; // Use '{' as the ceiling

    const idxL = BASE.indexOf(charL);
    const idxR = BASE.indexOf(charR) === -1 ? BASE.length : BASE.indexOf(charR);

    if (idxR - idxL > 1) {
      // Found a gap! Pick the middle character
      const mid = Math.floor((idxL + idxR) / 2);
      result += BASE[mid];
      break;
    } else {
      // No gap here, move to the next character position
      result += charL;
      i++;

      // If we've exhausted the right string, we append a midpoint
      if (i >= r.length && !l[i]) {
        result += "V";
        break;
      }
    }
  }
  return result;
}