/** 仅保留字母和数字 */
export function keepAlphaNumOnly(v: unknown) {
  if (v == null) return '';
  return String(v).replace(/[^0-9a-zA-Z]/g, '');
}