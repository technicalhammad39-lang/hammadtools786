import firebaseConfigFile from '@/firebase-config.json';

const REQUIRED_FIREBASE_PUBLIC_ENV_KEYS = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const;

type RequiredFirebasePublicEnvKey = (typeof REQUIRED_FIREBASE_PUBLIC_ENV_KEYS)[number];

function readRequiredEnv(key: RequiredFirebasePublicEnvKey) {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

function readOptionalEnv(key: string) {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

const requiredValues = REQUIRED_FIREBASE_PUBLIC_ENV_KEYS.reduce(
  (accumulator, key) => {
    accumulator[key] = readRequiredEnv(key);
    return accumulator;
  },
  {} as Record<RequiredFirebasePublicEnvKey, string>
);

const fallbackValues = {
  NEXT_PUBLIC_FIREBASE_API_KEY: String((firebaseConfigFile as any).apiKey || '').trim(),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: String((firebaseConfigFile as any).authDomain || '').trim(),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: String((firebaseConfigFile as any).projectId || '').trim(),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: String((firebaseConfigFile as any).storageBucket || '').trim(),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: String((firebaseConfigFile as any).messagingSenderId || '').trim(),
  NEXT_PUBLIC_FIREBASE_APP_ID: String((firebaseConfigFile as any).appId || '').trim(),
} as Record<RequiredFirebasePublicEnvKey, string>;

const resolvedValues = REQUIRED_FIREBASE_PUBLIC_ENV_KEYS.reduce(
  (accumulator, key) => {
    accumulator[key] = requiredValues[key] || fallbackValues[key];
    return accumulator;
  },
  {} as Record<RequiredFirebasePublicEnvKey, string>
);

export const missingFirebasePublicEnvKeys = REQUIRED_FIREBASE_PUBLIC_ENV_KEYS.filter((key) => !resolvedValues[key]);
export const hasFirebasePublicEnv = missingFirebasePublicEnvKeys.length === 0;
export const usingFirebaseConfigFallback =
  hasFirebasePublicEnv && REQUIRED_FIREBASE_PUBLIC_ENV_KEYS.some((key) => !requiredValues[key] && Boolean(fallbackValues[key]));

let hasLoggedMissingEnv = false;

export function logMissingFirebasePublicEnv(context: string) {
  if (hasFirebasePublicEnv || hasLoggedMissingEnv) {
    return;
  }

  hasLoggedMissingEnv = true;
  console.error(
    `[${context}] Missing required Firebase public env vars: ${missingFirebasePublicEnvKeys.join(', ')}`
  );
}

let hasLoggedFallbackUsage = false;
export function logFirebaseConfigFallback(context: string) {
  if (!usingFirebaseConfigFallback || hasLoggedFallbackUsage) {
    return;
  }
  hasLoggedFallbackUsage = true;
  console.warn(`[${context}] Using firebase-config.json fallback for Firebase client config.`);
}

export const firebaseClientConfig = {
  apiKey: resolvedValues.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: resolvedValues.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: resolvedValues.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: resolvedValues.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: resolvedValues.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: resolvedValues.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:
    readOptionalEnv('NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID') || String((firebaseConfigFile as any).measurementId || '').trim() || undefined,
};

export const firestoreDatabaseId =
  readOptionalEnv('NEXT_PUBLIC_FIRESTORE_DATABASE_ID') || String((firebaseConfigFile as any).firestoreDatabaseId || '').trim() || '(default)';

export function getFirebasePublicEnvErrorMessage() {
  return 'Authentication is temporarily unavailable. Please try again shortly.';
}

export function getCustomPasswordResetUrl() {
  const value = readOptionalEnv('NEXT_PUBLIC_PASSWORD_RESET_URL');
  const runningOnHammadDomain =
    typeof window !== 'undefined' &&
    (window.location.hostname === 'hammadtools.com' || window.location.hostname.endsWith('.hammadtools.com'));
  const fallbackForProduction = runningOnHammadDomain ? 'https://hammadtools.com/reset-password' : '';
  const candidate = value || fallbackForProduction;
  if (!candidate) {
    return null;
  }

  if (!candidate.startsWith('https://hammadtools.com/reset-password')) {
    console.warn(
      '[firebase-auth] NEXT_PUBLIC_PASSWORD_RESET_URL must start with https://hammadtools.com/reset-password. Falling back to Firebase default email action flow.'
    );
    return null;
  }

  return candidate;
}
