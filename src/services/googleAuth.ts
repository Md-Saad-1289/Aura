/**
 * Google Identity Services (GSI) and Google Sign-In Utility
 */

export interface GoogleUserProfile {
  googleId: string;
  name: string;
  email: string;
  avatar?: string;
  emailVerified?: boolean;
}

// Decode standard Google ID Token (JWT) on the client safely
export function decodeGoogleJwt(token: string): GoogleUserProfile | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return {
      googleId: parsed.sub || parsed.id || '',
      name: parsed.name || `${parsed.given_name || ''} ${parsed.family_name || ''}`.trim() || 'Google User',
      email: parsed.email || '',
      avatar: parsed.picture || undefined,
      emailVerified: parsed.email_verified || false,
    };
  } catch (error) {
    console.error('Error decoding Google JWT credential:', error);
    return null;
  }
}

// Dynamically load Google GSI script if not already present
export function loadGoogleGsiScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).google?.accounts?.id) {
      resolve(true);
      return;
    }

    const existingScript = document.getElementById('google-gsi-client');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Failed to load Google GSI script from Google CDN');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

// Get configured client ID or default placeholder
export function getGoogleClientId(): string {
  const envId = (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID;
  return envId && envId.trim().length > 0 ? envId.trim() : '';
}
