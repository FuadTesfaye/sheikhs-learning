/**
 * Cloudflare R2 Storage Configuration
 *
 * Bucket: sheikhs-learning
 * Region: Western Europe (WEUR)
 * Public Access Domain: https://pub-fef6f759612f4507b40841db6e61c2f4.r2.dev
 *
 * NOTE: For security, secret access keys are not embedded into client apps.
 * Public assets and course downloads use the public R2 domain with CORS enabled.
 */

export const CLOUDFLARE_R2_CONFIG = {
  accountId: 'ff68ccd8f55b3c1fcb78c043f54467c9',
  bucketName: 'sheikhs-learning',
  publicUrl:
    process.env.EXPO_PUBLIC_R2_URL ||
    'https://pub-fef6f759612f4507b40841db6e61c2f4.r2.dev',
  s3Endpoint:
    'https://ff68ccd8f55b3c1fcb78c043f54467c9.r2.cloudflarestorage.com',
};

/**
 * Returns a fully-qualified public download/streaming URL for an R2 key.
 */
export function getR2Url(key: string): string {
  if (!key) return '';
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  const cleanKey = key.startsWith('/') ? key.slice(1) : key;
  return `${CLOUDFLARE_R2_CONFIG.publicUrl}/${cleanKey}`;
}
