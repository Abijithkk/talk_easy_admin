"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { isTokenExpired } from "@/lib/checkToken";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const localToken = token || localStorage.getItem("token");

    const publicRoutes = ["/login"];

    if (publicRoutes.includes(pathname)) return;

    if (!localToken || isTokenExpired(localToken)) {
      dispatch(logout());
      router.push("/login");
    }
  }, [token, pathname, dispatch, router]);

  return <>{children}</>;
}
