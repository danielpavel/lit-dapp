import { auth } from "auth"
import { SignIn, SignOut } from "./auth-components"

export default async function SignInButton() {
  const session = await auth()

  if (!session?.user) return <SignIn provider="google"/>

      return <SignOut />
}
