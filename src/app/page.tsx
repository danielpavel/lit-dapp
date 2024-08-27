import { AuthComponent } from "@/components/ui/AuthComponent";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-slate-300">

      <h2 className="font-normal text-3xl">
        Lit Dapp
      </h2>

      <div>
        <AuthComponent />
      </div>
    </main>
  );
}
