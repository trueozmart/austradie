export const CONTACT_EMAIL = 'corepagesaustralia@gmail.com';

export function buildMailto(subject: string, lines: (string | undefined | false)[]) {
  const body = lines.filter((line): line is string => Boolean(line)).join('\n');
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
