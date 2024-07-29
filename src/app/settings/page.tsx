"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import OTPBox from "@/components/OTPBox";
import { Input } from "@/components/ui/input";
import { useApiFetch, useApiMutate } from "@/hooks/useApiRequests";
import Loading from "@/components/Loading";
import useUserContext from "@/hooks/useUserContext";
import UserSettingsAuth from "@/components/UserSettingsAuth";
import { toast } from "sonner";

const page = () => {
  const { user } = useUserContext();
  const [otp, setOtp] = useState<string>("");
  const [otpForDeleteAccount, setOtpForDeleteAccount] =
    useState<boolean>(false);
  const [otpForChangePassword, setOtpForChangePassword] =
    useState<boolean>(false);
  const [otpForVerifyAccount, setOtpForVerifyAccount] =
    useState<boolean>(false);
  const [currPassword, setCurrPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const {
    data: profile,
    isPending,
    error,
    refetch,
  } = useApiFetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/users/${user}`, [
    `user|${user}`,
  ]);

  // Verify Account
  const { isPending: verifyingAccount, mutate: verifyAccount } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/verify-account/${user}?OTP=${otp}`,
    "POST",
    [`user|${user}`]
  );

  // Delete Account
  const {
    data: deleteSuccess,
    isPending: deleting,
    mutate: deleteAccount,
  } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${user}?OTP=${otp}`,
    "DELETE"
  );

  // Change Password
  const {
    data: changePasswordSuccess,
    isPending: changingPassword,
    error: changePasswordError,
    mutate: changePassword,
  } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/change-password/${user}?OTP=${otp}`,
    "PATCH",
    [`user|${user}`]
  );

  const resendCode = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/resend-otp/${user}`,
      { withCredentials: true }
    );
    if (res.status === 200) toast.info(res.data.message);
  };

  useEffect(() => {
    if (changePasswordSuccess && changePasswordSuccess.status === 200) {
      setCurrPassword("");
      setNewPassword("");
    }
    if (deleteSuccess && deleteSuccess.status === 200) location.href = "/";
  }, [changePasswordSuccess, deleteSuccess]);

  return (
    <main className="container">
      <div className="header-text">
        <h1 className="text-3xl font-semibold">Settings</h1>
      </div>

      {/* OTP for verifying account */}
      <OTPBox
        otp={otp}
        dialogOpen={otpForVerifyAccount}
        dialogClose={() => setOtpForVerifyAccount(false)}
        setOTP={setOtp}
        trigger={() => {
          setOtpForVerifyAccount(false);
          verifyAccount({});
        }}
        notFor2FA={true}
      />

      {/* OTP for deleting account */}
      <OTPBox
        otp={otp}
        dialogOpen={otpForDeleteAccount}
        dialogClose={() => setOtpForDeleteAccount(false)}
        setOTP={setOtp}
        trigger={() => {
          setOtpForDeleteAccount(false);
          deleteAccount({});
        }}
        description="By continuing, you confirm to deleting this account permanently"
      />

      {/* OTP for changing password */}
      <OTPBox
        otp={otp}
        dialogOpen={otpForChangePassword}
        dialogClose={() => setOtpForChangePassword(false)}
        setOTP={setOtp}
        trigger={() => {
          setOtpForChangePassword(false);
          changePassword({ currPassword, newPassword });
        }}
      />

      {isPending && <Loading />}

      {!isPending && error && !profile && (
        <div className="flex flex-col items-center gap-3">
          <p>Something went wrong</p>
          <Button onClick={() => refetch()}>Retry</Button>
        </div>
      )}

      {!isPending && profile && profile.data && (
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader className="space-y-2">
              <CardTitle>Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input value={profile.data.email} disabled />

              <div className="flex justify-between items-center">
                <Button
                  onClick={() => setOtpForVerifyAccount(true)}
                  className={profile.data.isVerified && "bg-green-500"}
                  type="submit"
                  disabled={verifyingAccount || profile.data.isVerified}
                >
                  {verifyingAccount
                    ? "Verifying your Account..."
                    : profile.data.isVerified
                      ? "Verified"
                      : "Verify Account"}
                </Button>
                {!profile.data.isVerified && (
                  <Button variant="link" onClick={resendCode}>
                    Resend Code
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <UserSettingsAuth profile={profile.data} />

          {/* Change Password */}
          <Card x-chunk="dashboard-04-chunk-2">
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardDescription>
                <span>
                  If you have forgotten your password, reset it{" "}
                  <Link
                    href="/auth/forgot-password"
                    className="text-primary font-semibold"
                  >
                    here
                  </Link>
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setOtpForChangePassword(true);
                }}
              >
                <Input
                  required
                  value={currPassword}
                  placeholder="Current Password"
                  onChange={(e) => setCurrPassword(e.target.value)}
                />
                <Input
                  required
                  value={newPassword}
                  placeholder="New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {changePasswordError?.response?.data?.message && (
                  <p className="text-red-500 text-sm">
                    {changePasswordError?.response?.data?.message}
                  </p>
                )}
                <Button
                  type="submit"
                  disabled={
                    changingPassword ||
                    currPassword.length == 0 ||
                    newPassword.length == 0
                  }
                >
                  {changingPassword
                    ? "Changing Password..."
                    : "Change Password"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Delete Account */}
          <Card x-chunk="dashboard-04-chunk-2">
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                By deleting your account, you lose all your data and secrets
                from this application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                disabled={deleting}
                onClick={() => setOtpForDeleteAccount(true)}
                variant="destructive"
              >
                {deleting ? "Deleting Account..." : "Delete Account"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
};

export default page;
