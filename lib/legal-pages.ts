import { normalizeRichTextValue, richTextToPlainText } from '@/lib/rich-text';

export type LegalPageKey = 'privacy-policy' | 'terms-and-conditions';

export type LegalPageContent = {
  id: LegalPageKey;
  title: string;
  path: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt?: Date | null;
};

export const LEGAL_PAGE_KEYS: LegalPageKey[] = ['privacy-policy', 'terms-and-conditions'];

export const LEGAL_PAGE_DEFINITIONS: Record<LegalPageKey, LegalPageContent> = {
  'privacy-policy': {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    path: '/privacy-policy',
    metaTitle: 'Privacy Policy - Hammad Tools',
    metaDescription: 'Read Hammad Tools privacy policy to understand how we collect, use, and protect your data.',
    content: normalizeRichTextValue(`
## Privacy Policy

At Hammad Tools, we take your privacy seriously. This policy explains how we collect, use and protect information when you use our website, place orders or contact our support team.

## Information We Collect

We may collect your name, email address, phone number, order details, payment proof details and support messages when you interact with our website.

## How We Use Information

We use this information to process orders, manage customer support, improve our services, prevent fraud and communicate important updates.

## Data Security

We use reasonable security practices to protect customer data and limit access to authorized team members only.

## Third-Party Services

We may use trusted third-party services for hosting, analytics, payments, notifications or communication. We do not sell your personal information.

## Policy Updates

We may update this policy when our services or legal requirements change. The latest version will always be available on this page.
`),
    updatedAt: null,
  },
  'terms-and-conditions': {
    id: 'terms-and-conditions',
    title: 'Terms & Conditions',
    path: '/terms-and-conditions',
    metaTitle: 'Terms & Conditions - Hammad Tools',
    metaDescription: 'Read Hammad Tools terms and conditions for orders, subscriptions, usage, payments and support policies.',
    content: normalizeRichTextValue(`
## Terms & Conditions

By accessing Hammad Tools or purchasing from our website, you agree to follow these terms and conditions.

## Use of Services

You agree to use our digital products, subscriptions and services responsibly and only for lawful purposes.

## Orders and Delivery

Digital orders are processed according to the selected product or service details. Delivery timelines may vary depending on account setup, verification or service scope.

## Payments and Refunds

Payments must be completed through the available payment methods. Because many products are digital subscriptions or activated services, refunds may be limited after activation unless clearly stated otherwise.

## Account Responsibility

You are responsible for keeping your account credentials, access details and shared information secure.

## Service Changes

We may update products, prices, terms, availability or support policies when needed to keep the platform stable and secure.
`),
    updatedAt: null,
  },
};

export function isLegalPageKey(value: string): value is LegalPageKey {
  return LEGAL_PAGE_KEYS.includes(value as LegalPageKey);
}

function readDate(value: unknown): Date | null {
  const candidate =
    (value as { toDate?: () => Date } | null | undefined)?.toDate?.() || value;
  if (!candidate) {
    return null;
  }
  if (candidate instanceof Date) {
    return Number.isNaN(candidate.getTime()) ? null : candidate;
  }
  if (typeof candidate === 'number' || typeof candidate === 'string') {
    const parsed = new Date(candidate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function readString(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export function normalizeLegalPageContent(
  key: LegalPageKey,
  data?: Record<string, unknown> | null
): LegalPageContent {
  const fallback = LEGAL_PAGE_DEFINITIONS[key];
  const content = normalizeRichTextValue(readString(data?.content) || fallback.content);
  const metaDescription =
    readString(data?.metaDescription) ||
    richTextToPlainText(content).slice(0, 160) ||
    fallback.metaDescription;

  return {
    id: key,
    title: readString(data?.title) || fallback.title,
    path: fallback.path,
    content: content || fallback.content,
    metaTitle: readString(data?.metaTitle) || fallback.metaTitle,
    metaDescription,
    updatedAt: readDate(data?.updatedAt) || fallback.updatedAt || null,
  };
}
