export const contact = {
  whatsapp: '51938888511',
  display: '+51 938 888 511',
  location: 'Juliaca, Perú',
};
export function whatsappUrl(message) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
