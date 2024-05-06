"use client";
import { useState } from "react";
import { Dashboard } from "../components/dashboard";
import InternalRoute from "../components/internal_route";

export const dynamic = 'force-dynamic';
export default function Home() {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <main className="h-screen w-[95vw] grid place-items-center mx-auto relative">
      <InternalRoute isAdmin={isAdmin} setIsAdmin={setIsAdmin}>
        <>
          <Dashboard />
          <div className="w-full h-[6vh]" />
        </>
      </InternalRoute>
    </main>
  );
};