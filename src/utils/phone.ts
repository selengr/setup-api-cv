/** Iranian mobile numbers: 09xxxxxxxxx / +989... / 00989... */
export const IRAN_PHONE_REGEX =
  /^(0|0098|\+98)9(0[1-5]|[13]\d|2[0-2]|98)\d{7}$/;

export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+98')) return `0${trimmed.slice(3)}`;
  if (trimmed.startsWith('0098')) return `0${trimmed.slice(4)}`;
  return trimmed;
}
