import { getSessionSigs } from "@/lib/lit";
import { LitPKPResource } from "@lit-protocol/auth-helpers";
import { AuthMethod, IRelayPKP, LitAbility, SessionSigs } from "@lit-protocol/types";
import { useCallback, useState } from "react";

export default function useSession() {
  const [sessionSigs, setSessionSigs] = useState<SessionSigs>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const initSession = useCallback(
    async (authMethod: AuthMethod, pkp: IRelayPKP): Promise<void> => {
      setLoading(true);
      setError(undefined);

      try {
        // const chain = 'ehtereum';
        const resourceAbilities = [{
          resource: new LitPKPResource("*"),
          ability: LitAbility.PKPSigning
        }]

        // const expiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

        const sessionSigs = await getSessionSigs({
          pkpPublicKey: pkp.publicKey,
          authMethod,
          resourceAbilityRequests: resourceAbilities,
          // expiration
        })

        setSessionSigs(sessionSigs);
      } catch (err) {
        setError(err as Error);
      } finally { 
        setLoading(false);
      }

    }, [])

  return {initSession, sessionSigs, loading, error};
}
