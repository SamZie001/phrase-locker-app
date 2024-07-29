"use client";
import { useContext } from "react";
import { UserContext } from "@/providers/UserProvider";

export default function useUserContext() {
  const context = useContext(UserContext);

  if (!context)
    throw Error("'useUserContext' must be used inside a user context provider");

  return context;
}
