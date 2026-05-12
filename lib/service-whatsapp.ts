const SERVICE_WHATSAPP_NUMBER = '923209310656';
const SERVICE_WHATSAPP_BASE_URL = `https://wa.me/${SERVICE_WHATSAPP_NUMBER}`;

export function buildServiceWhatsAppMessage(serviceName?: string, serviceDescription?: string) {
  const title = (serviceName || 'Digital Solutions').replace(/\s+/g, ' ').trim();
  const description = (serviceDescription || 'I need guidance for a digital service.')
    .replace(/\s+/g, ' ')
    .trim();

  return [
    'Hi HammadTools, I want to discuss a service.',
    '',
    `Service: ${title || 'Digital Solutions'}`,
    `Details: ${description || 'I need guidance for a digital service.'}`,
    '',
    'Please guide me about pricing and process.',
  ].join('\n');
}

export function buildServiceWhatsAppUrl(serviceName?: string, serviceDescription?: string) {
  return `${SERVICE_WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    buildServiceWhatsAppMessage(serviceName, serviceDescription)
  )}`;
}
