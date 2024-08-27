import { IRelayPKP, SessionSigs } from "@lit-protocol/types"

interface DashboardProps {
  currentAccount: IRelayPKP,
  sessionSigs: SessionSigs
}

export function Dashboard({currentAccount, sessionSigs}: DashboardProps) {

  return (
    <div className="flex flex-col bg-pink-300 w-full p-2 border border-black rounded-lg">
      <h3>
        Hi This is dashboard
      </h3>

      <h3>Current account: {currentAccount.publicKey}</h3>
    </div>
  )
}
