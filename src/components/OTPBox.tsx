"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPBox = ({
  otp,
  description,
  dialogOpen,
  dialogClose,
  setOTP,
  trigger,
  notFor2FA,
}: {
  otp: string;
  description?: string;
  dialogOpen: boolean;
  dialogClose: React.Dispatch<React.SetStateAction<boolean>>;
  setOTP: React.Dispatch<React.SetStateAction<string>>;
  trigger: () => void;
  notFor2FA?: boolean;
}) => {
  return (
    <Dialog open={dialogOpen} onOpenChange={dialogClose}>
      <DialogContent
        className="w-[95%] md:w-full rounded-md flex flex-col"
        aria-describedby="OTP dialog"
        aria-description="OTP dialog"
      >
        <DialogHeader>
          <DialogTitle className="header-text">
            <span className="font-bold text-3xl text-center">
              Enter the OTP {!notFor2FA && "from your authenticator app"}
            </span>
            {!notFor2FA && (
              <p className="text-muted-foreground">
                Haven't set-up 2FA yet? Scan the code in this{" "}
                <Link className="text-primary underline" href={"/settings"}>
                  page
                </Link>
              </p>
            )}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center text-destructive">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="flex justify-center items-center">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(value) => setOTP(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} className="font-bold" />
              <InputOTPSlot index={1} className="font-bold" />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot index={2} className="font-bold" />
              <InputOTPSlot index={3} className="font-bold" />
            </InputOTPGroup>

            <InputOTPSeparator />

            <InputOTPGroup>
              <InputOTPSlot index={4} className="font-bold" />
              <InputOTPSlot index={5} className="font-bold" />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          variant="default"
          size="lg"
          color="primary"
          className="w-full"
          onClick={trigger}
          type="submit"
          disabled={otp.length !== 6}
        >
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default OTPBox;
