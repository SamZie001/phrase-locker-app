"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { useApiMutate } from "@/hooks/useApiRequests";

const page = () => {
  const [email, setEmail] = useState<string>("");

  const { mutate: handleSubmit, isPending: loading } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/forgot-password`,
    "POST"
  );

  return (
    <div className="space-y-5">
      <div className="header-text">
        <h1>Reset Password</h1>
        <p>Enter your email to reset your password</p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit({ email });
        }}
        className="w-full md:w-[400px] mx-auto space-y-3 px-4 pb-4"
      >
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            placeholder="Enter your email"
            required
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
          />
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <Button
            size="lg"
            type="submit"
            className="w-full"
            disabled={loading || !email.length}
          >
            {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Sending temporary password" : "Send temporary password"}
          </Button>
          <Link href="/auth/login" className="text-sm text-primary underline">
            Back to login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default page;
