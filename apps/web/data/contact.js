export const contact = {
  whatsapp: '51978371277',
  display: '+51 978 371 277',
  location: 'Juliaca, Perú',
};
export function whatsappUrl(message) {
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(message)}`;
}
