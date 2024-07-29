"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import { IoReload } from "react-icons/io5";
import { useApiMutate } from "@/hooks/useApiRequests";
import userContext from "@/hooks/useUserContext";

const page = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { setUser } = userContext();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    data,
    mutate: handleSubmit,
    error,
    isPending: loading,
  } = useApiMutate(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/local`, "POST");

  useEffect(() => {
    if (data && data.status === 200) {
      const user = document?.cookie?.split("user_id=")[1];
      if (user) setUser(user);
    }
  }, [data]);

  return (
    <div className="space-y-5">
      <div className="header-text">
        <h1>Login</h1>
        <p>Enter your credentials to access your phrase locker</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({ email, password });
        }}
        className="w-full md:w-[400px] mx-auto space-y-3 px-4 pb-4"
      >
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
          />
          {error?.response?.data?.email && (
            <p className="text-red-500 text-sm">
              {error?.response?.data?.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Password</Label>
          <Input
            required
            type={isVisible ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            disabled={loading}
          />
          {error?.response?.data?.password && (
            <p className="text-red-500 text-sm">
              {error?.response?.data?.password}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center gap-5">
          <div className="flex gap-2 items-center">
            <Checkbox disabled={loading} onClick={toggleVisibility} />
            <p className="text-sm text-muted-foreground">Show password</p>
          </div>

          <Link
            href="/auth/forgot-password"
            className="text-sm text-primary underline"
          >
            Forgot password
          </Link>
        </div>

        <div className="space-y-2">
          <Button
            variant="default"
            size="lg"
            type="submit"
            className="w-full"
            disabled={loading || !email.length || !password.length}
          >
            {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Entering your locker.." : "Enter locker"}
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className=" w-full"
            disabled={loading}
          >
            <Link
              href={process.env.NEXT_PUBLIC_SERVER_URL + "/auth/google"}
              className="space-x-2"
            >
              <FcGoogle size={35} />
              <p>Continue with Google</p>
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default page;
