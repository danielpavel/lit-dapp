"use client";

import useAuthenticate from "@/hooks/useAuthenticate";
import { ORIGIN, signInWithGoogle } from "@/lib/lit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./button";

export function AuthComponent() {
  const redirectUri = ORIGIN

  console.log("redirectUri:", redirectUri);

  const {
    authMethod,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const router = useRouter();

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      console.log("authMethod:", authMethod);

      router.replace(window.location.pathname);

      // fetchAccounts(authMethod);
    }
  }, [authMethod]);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (authError) {
    return <div>Error...</div>;
  }

  if (authMethod) {
    return(
      <div className="flex flex-col bg-gray-100 rounded-md">
        <div className="p-4 font-bold bg-gray-200 rounded-t-md">
          Auth Method
        </div>

        <pre className="py-6 px-4 whitespace-pre-wrap break-all">
          {JSON.stringify(authMethod, null, 2)}
        </pre>
      </div>
    );
  }

  return (
    <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
  )
 }
