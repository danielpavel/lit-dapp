"use client";

import useAuthenticate from "@/hooks/useAuthenticate";
import { ORIGIN, signInWithGoogle } from "@/lib/lit";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import Loading from "./Loading";
import useAccounts from "@/hooks/useAccount";
import useSession from "@/hooks/useSession";
import { Dashboard } from "./Dashboard";

export function MainComponent() {
  const redirectUri = ORIGIN

  const {
    authMethod,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const {
    createAccount,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError } = useSession();

  const router = useRouter();

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  useEffect(() => {
    // If user is authenticated, fetch accounts
    if (authMethod) {
      router.replace(window.location.pathname);

      // fetchAccounts(authMethod);
    }
  }, [authMethod]);

  const error = authError || accountsError;

  if (error) {
    if (authError) {
      console.error('Auth error:', authError);
    }

    if (accountsError) {
      console.error('Accounts error:', accountsError);
    }

    if (sessionError) {
      console.error('Session error:', sessionError);
    }
  }

  useEffect(() => {
    // If user is authenticated, create an account
    if (authMethod) {
      router.replace(window.location.pathname);
      createAccount(authMethod);
    }
  }, [authMethod, createAccount]);

  useEffect(() => {
    // If user is authenticated and has at least one account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  if (authLoading) {
    return <Loading copy={"Waiting for authentiacation..."} error={authError} />
  }

  if (accountsLoading) {
    return <Loading copy={'Creating your account...'} error={accountsError} />;
  }

  if (sessionLoading) {
    return <Loading copy={'Securing your session...'} error={sessionError} />;
  }

  if (currentAccount && sessionSigs) {
    return (<Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs}/>)
  } else {

    return (
      <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
    )
  }
}
