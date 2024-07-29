"use client";
import React from "react";
import axios from "axios";
import { toast } from "sonner";

export const UserContext = React.createContext<{
  user: string | null;
  setUser: React.Dispatch<React.SetStateAction<string | null>>;
  userLogout: () => void;
} | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<string | null>(null);

  const userLogout = async () => {
    toast.loading("Logging you out...", {
      duration: undefined,
    });

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`,
      { withCredentials: true }
    );

    if (response.status === 200) location.href = "/auth/login";
  };

  React.useEffect(() => {
    const user = document?.cookie?.split("user_id=")[1];
    setUser(user || null);
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, userLogout }}>
      {children}
    </UserContext.Provider>
  );
};
