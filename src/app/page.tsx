import { Dashboard } from "@/components/Dashboard";
import { MainComponent } from "@/components/MainComponent";

export default async function Home() {
  return (
    <main className="min-h-screen p-24">
      <div className="mx-auto px-2 max-w-8xl md:px-6 w-full">
        <div className="flex flex-col space-y-2 items-center">

          <h2 className="font-normal text-3xl">
            Welcome to Lit Dapp
          </h2>
          <h2 className="font-normal text-xl pt-4 pb-12">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
          </h2>

          <div>
            <MainComponent />
          </div>

          {/* <Dashboard /> */}
        </div>
      </div>
    </main>
  );
}
