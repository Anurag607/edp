import { Dashboard } from "../components/dashboard"

export default function Home() {
  return (
    <main className="h-screen w-[95vw] grid place-items-center mx-auto relative">
      <Dashboard />
      <div className="w-full h-[6vh]" />
    </main>
  );
}
