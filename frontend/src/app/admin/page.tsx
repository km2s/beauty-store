"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth";

export default function AdminRoot() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn()) router.replace("/admin/dashboard");
    else router.replace("/admin/login");
  }, [isLoggedIn, router]);

  return null;
}
