"use client";

import Dashboard from "@/lib/getDashboardData";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
<Dashboard />
  );
}
