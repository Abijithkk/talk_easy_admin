"use client";
import { usePathname } from "next/navigation";
import Layout from "./layout/Layout";

export default function LayoutConditionalWrapper({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}