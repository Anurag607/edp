import { Dashboard } from "../../components/dashboard"

export const dynamic = 'force-dynamic';
export default function Home() {
  return (
    <main className="h-screen w-[95vw] grid place-items-center mx-auto relative">
      <Dashboard />
      <div className="w-full h-[6vh]" />
    </main>
  );
}
