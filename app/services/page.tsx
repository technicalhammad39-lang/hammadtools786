import type { Metadata } from 'next';
import ServicesPageClient from './ServicesPageClient';
import { createPageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = createPageMetadata({
  title: 'Digital Solutions | Web, App, Software, AI & Design Services',
  description:
    'Explore web development, app development, Shopify, WooCommerce, AI, SaaS, software, logo and graphic design services for business growth.',
  path: '/services',
  image: '/services-card.webp',
  keywords: [
    'digital solutions',
    'web development services',
    'app development services',
    'AI development',
    'SaaS development',
    'software development',
    'Shopify development',
    'WooCommerce development',
    'logo design',
    'graphic design',
  ],
});

export default function ServicesPage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What services does your digital agency provide?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'We provide web development, app development, Shopify and WooCommerce stores, AI development, software development, SaaS development, graphic design and logo design services.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you build a complete website and brand identity together?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we can design your logo, brand visuals and complete website so your business has a consistent and professional online presence.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do you build custom software or SaaS platforms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we build custom business software and SaaS platforms with dashboards, user accounts, admin panels, payments and scalable features.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can you develop AI tools for my business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, we can build AI chatbots, AI website widgets, automation tools and custom AI workflows based on your business needs.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can I start a project with you?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'You can open the WhatsApp consultation button, select your required service and discuss pricing, timeline and process directly with our team.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ServicesPageClient />
    </>
  );
}
