export function normalizeSriLankanPhone(input: string) {
  const compact = input.replace(/[^\d+]/g, "");

  if (/^07\d{8}$/.test(compact)) {
    return `+94${compact.slice(1)}`;
  }

  if (/^\+947\d{8}$/.test(compact)) {
    return compact;
  }

  if (/^947\d{8}$/.test(compact)) {
    return `+${compact}`;
  }

  return null;
}

export function maskPhone(phone: string) {
  return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7, 10)} ${phone.slice(10)}`;
}
