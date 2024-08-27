import { ProviderType, LitNetwork, AuthMethodScope } from '@lit-protocol/constants';
import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  GoogleProvider,
  LitAuthClient,
} from '@lit-protocol/lit-auth-client';

import {
  AuthMethod,
  IRelayPKP,
  LIT_NETWORKS_KEYS,
  LitAbility,
  SessionSigs,
} from '@lit-protocol/types';
import { LitPKPResource } from '@lit-protocol/auth-helpers';

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

interface ResourceAbility {
  resource: LitPKPResource;
  ability: LitAbility;
}

export async function getSessionSigs(
  {
    pkpPublicKey,
    authMethod,
    resourceAbilityRequests,
  }: {pkpPublicKey: string, authMethod: AuthMethod, resourceAbilityRequests: ResourceAbility[]}): Promise<SessionSigs> {

  const provider = litAuthClient.getProvider(ProviderType.Google);

  if (!provider) {
    throw new Error('Provider not found');
  }

  await litNodeClient.connect();

  const sessionSigs = await litNodeClient.getPkpSessionSigs({
    pkpPublicKey,
    authMethods: [authMethod],
    resourceAbilityRequests
  })


  return sessionSigs;
}

export async function getPKPs(authMethod: AuthMethod): Promise<IRelayPKP[] | undefined> {
  const provider = litAuthClient.getProvider(ProviderType.Google);
  const pkps = await provider?.fetchPKPsThroughRelayer(authMethod)
  return pkps
}

export async function mintPKP(authMethod: AuthMethod): Promise<IRelayPKP | undefined> {
  const provider = litAuthClient.getProvider(ProviderType.Google);

  const options = {
    permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]]
  }

  let txHash: string | undefined;

  // Mint PKP through relay server
  txHash = await provider?.mintPKPThroughRelayer(authMethod, options);

  let attempts = 3;
  let response = null;

  while (attempts > 0) {
    try {
      response = await provider?.relay.pollRequestUntilTerminalState(txHash as string);
      break;
    } catch (err) {
      console.warn('Minting PKP failed, retrying...', err);

      // sleep for 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000));

      attempts --;
    }
  }

  if (!response || response.status != "Succeeded") {
    throw new Error('Minting PKP Failed!');
  }

  const newPkp: IRelayPKP = {
    tokenId: response.pkpTokenId!,
    publicKey: response.pkpPublicKey!,
    ethAddress: response.pkpEthAddress!,
  }

  return newPkp;
}
