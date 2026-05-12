const SERVICE_WHATSAPP_NUMBER = '923209310656';
const SERVICE_WHATSAPP_BASE_URL = `https://wa.me/${SERVICE_WHATSAPP_NUMBER}`;

export type ServicePriceSource = {
  price?: string | number | null;
  servicePrice?: string | number | null;
  startingPrice?: string | number | null;
  basePrice?: string | number | null;
  minPrice?: string | number | null;
  budget?: string | number | null;
};

export function formatServicePrice(value?: string | number | null) {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? `Rs ${value.toLocaleString('en-PK')}` : '';
  }

  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim();
}

export function getServicePriceLabel(service?: ServicePriceSource | null) {
  if (!service) {
    return '';
  }

  return (
    formatServicePrice(service.price) ||
    formatServicePrice(service.servicePrice) ||
    formatServicePrice(service.startingPrice) ||
    formatServicePrice(service.basePrice) ||
    formatServicePrice(service.minPrice) ||
    formatServicePrice(service.budget)
  );
}

export function buildServiceWhatsAppMessage(serviceName?: string, servicePrice?: string | number | null) {
  const title = (serviceName || 'Digital Solutions').replace(/\s+/g, ' ').trim();
  const price = formatServicePrice(servicePrice);
  const serviceLines = [`Service: ${title || 'Digital Solutions'}`];
  if (price) {
    serviceLines.push(`Price: ${price}`);
  }

  return [
    'Hi HammadTools, I want to discuss a service.',
    '',
    ...serviceLines,
    '',
    'Please guide me about pricing and process.',
  ].join('\n');
}

export function buildServiceWhatsAppUrl(serviceName?: string, servicePrice?: string | number | null) {
  return `${SERVICE_WHATSAPP_BASE_URL}?text=${encodeURIComponent(
    buildServiceWhatsAppMessage(serviceName, servicePrice)
  )}`;
}
