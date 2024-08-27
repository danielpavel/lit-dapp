// import { LitAuthClient } from '@lit-protocol/lit-auth-client';
import { ProviderType, LitNetwork } from '@lit-protocol/constants';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  GoogleProvider,
  LitAuthClient,
} from '@lit-protocol/lit-auth-client';

import {
  AuthMethod,
  LIT_NETWORKS_KEYS,
} from '@lit-protocol/types';

export const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'localhost';
export const ORIGIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${DOMAIN}`
    : `http://${DOMAIN}:3001`;

export const SELECTED_LIT_NETWORK = ((process.env
  .NEXT_PUBLIC_LIT_NETWORK as string) ||
  LitNetwork.DatilDev) as LIT_NETWORKS_KEYS;

export const litNodeClient: LitNodeClient = new LitNodeClient({
  alertWhenUnauthorized: false,
  litNetwork: SELECTED_LIT_NETWORK as LIT_NETWORKS_KEYS,
  debug: false,
});

litNodeClient.connect();

export const litAuthClient: LitAuthClient = new LitAuthClient({
  litRelayConfig: {
    relayApiKey: 'test-api-key',
  },
  litNodeClient,
});

/**
 * Redirect to Lit login
 */
export async function signInWithGoogle(redirectUri: string): Promise<void> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  await googleProvider.signIn();
}

/**
 * Get auth method object from redirect
 */
export async function authenticateWithGoogle(
  redirectUri: string
): Promise<AuthMethod | undefined> {
  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  const authMethod = await googleProvider.authenticate();
  return authMethod;
}

