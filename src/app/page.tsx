import { Button } from "@/components/ui/button"
import { auth } from "auth";

export default async function Home() {
  const session = await auth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-300">
      <h2 className="font-normal text-3xl">
      Lit Dapp
    </h2>

        <div className="flex flex-col bg-gray-100 rounded-md">
          <div className="p-4 font-bold bg-gray-200 rounded-t-md">
          Current Session
        </div>
          <pre className="py-6 px-4 whitespace-pre-wrap break-all">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>

        <div>

          <Button>Click me</Button>
        </div>
      </main>
  );
}
