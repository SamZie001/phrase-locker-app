"use client";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useUserContext from "@/hooks/useUserContext";
import { copyText } from "@/lib/utils";

const UserSettingsAuth = ({ profile }: { profile: any }) => {
  const { user } = useUserContext();
  const [qrCode, setQrCode] = useState<{ qrCode: string; key: string } | null>(
    null
  );
  const [loadingQrCode, setLoadingQrCode] = useState<boolean>(false);

  const getQrCode = async () => {
    try {
      setLoadingQrCode(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/get-2fa-qr/${user}`,
        { withCredentials: true }
      );
      if (res.status === 200) setQrCode(res.data);
    } catch (error) {
    } finally {
      setLoadingQrCode(false);
    }
  };

  return (
    <>
      {profile && (
        <div className="grid gap-6">
          <Card x-chunk="dashboard-04-chunk-1">
            <CardHeader className="space-y-2">
              <CardTitle>Two-factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qrCode?.qrCode && (
                <div className="space-y-2">
                  <p>Scan this code in your authenticator app</p>
                  <Image src={qrCode.qrCode} alt="" width={250} height={250} />
                </div>
              )}

              {qrCode?.key && (
                <div className="space-y-2">
                  <p>Or enter this setup key in your authenticator app</p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <p className="text-xs p-2 bg-muted font-semibold text-muted-foreground rounded-lg max-w-full break-all tracking-wider">
                      {qrCode.key}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => copyText(qrCode.key)}
                    >
                      Copy Key
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={getQrCode} disabled={loadingQrCode}>
                {loadingQrCode ? "Getting QR Code..." : "Get QR"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default UserSettingsAuth;
