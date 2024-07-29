"use client";
import React, { useState, useEffect } from "react";
import useUserContext from "@/hooks/useUserContext";
import { usePathname } from "next/navigation";

const ProtectedPages = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUserContext();
  const pathName = usePathname();
  const userRestrictedPaths = [/^\/$/, /^\/secret(?:\/|$)/, "/settings"];
  const authPaths = ["/auth/login", "/auth/register"];
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to delay the redirect logic;
    const timer = setTimeout(() => {

      const inRestrictedPath = userRestrictedPaths.some((path) => {
        if (typeof path === "string") {
          return pathName === path;
        } else if (path instanceof RegExp) {
          return path.test(pathName);
        }
        return false;
      });

      const isAuthPath = authPaths.some((path) => pathName === path);

      if (inRestrictedPath && !user) window.location.href = "/auth/login";
      if (isAuthPath && user) window.location.href = "/";
    }, 1000);

    setLoading(false);
    // Cleanup function to clear the timeout if the component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [user, pathName]);

  if (loading) return null;

  return <section>{children}</section>;
};

export default ProtectedPages;
