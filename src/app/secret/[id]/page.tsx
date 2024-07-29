"use client";
import React, { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import Link from "next/link";
import OTPBox from "@/components/OTPBox";
import { useApiFetch, useApiMutate } from "@/hooks/useApiRequests";
import userContext from "@/hooks/useUserContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { FaRegCopy as FaCopy } from "react-icons/fa6";
import { copyText } from "@/lib/utils";

const page = () => {
  const { id } = useParams();
  const { user } = userContext();
  const [otp, setOTP] = useState<string>("");
  const [otpForShowPhrase, setOtpForShowPhrase] = useState<boolean>(false);
  const [otpForDeletePhrase, setOtpForDeletePhrase] = useState<boolean>(false);
  const [decodedPhrases, setDecodedPhrases] = useState<string[]>([]);

  const {
    data: secret,
    isPending,
    error,
    refetch,
  } = useApiFetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/secrets/${user}/${id}`,
    [`secret|${id}`]
  );

  // Show Phrase
  const {
    data: decodeSuccess,
    isPending: decoding,
    mutate: decodePhrase,
  } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/secrets/show-secret/${user}/${id}?OTP=${otp}`,
    "POST",
    [`secret|${id}`]
  );

  // Delete Phrase
  const {
    data: deleteSuccess,
    isPending: deleting,
    mutate: deletePhrase,
  } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/secrets/${user}/${id}?OTP=${otp}`,
    "DELETE",
    [`secret|${id}`]
  );

  useEffect(() => {
    if (decodeSuccess?.status === 200)
      setDecodedPhrases(decodeSuccess.data.secretPhrases);
    if (deleteSuccess?.status === 200) location.href = "/";
  }, [decodeSuccess, deleteSuccess]);

  return (
    <div className="container md:p-10 flex justify-center items-center">
      <div className="bordered-container space-y-8">
        <Button
          asChild
          className="m-5 z-50 rounded-xl md:mr-auto"
          variant="secondary"
        >
          <Link href="/" className="space-x-1">
            Go Back
          </Link>
        </Button>

        {/* OTP for showing phrases */}
        <OTPBox
          otp={otp}
          dialogOpen={otpForShowPhrase}
          dialogClose={() => setOtpForShowPhrase(false)}
          setOTP={setOTP}
          trigger={() => {
            setOtpForShowPhrase(false);
            decodePhrase({});
          }}
          description="By continuing, you confirm to reveal your phrases"
        />

        {/* OTP for deleting from list */}
        <OTPBox
          otp={otp}
          dialogOpen={otpForDeletePhrase}
          dialogClose={() => setOtpForDeletePhrase(false)}
          setOTP={setOTP}
          trigger={() => {
            setOtpForDeletePhrase(false);
            deletePhrase({});
          }}
          description="By continuing, you confirm to deleting this record permanently"
        />

        {isPending && <Loading />}

        {!isPending && error && (
          <div className="flex flex-col items-center gap-3">
            <p>Something went wrong</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        )}

        {!isPending && secret && secret.data && (
          <>
            <div className="header-text">
              <h1>{secret.data.walletName}</h1>
              <p>{secret.data.walletEmail}</p>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="space-y-2 text-center">
                <p className="underline font-semibold">Phrase</p>
                {decodedPhrases.length === 0 ? (
                  <p>{"*".repeat(secret.data.wordcount)}</p>
                ) : (
                  <div className="flex gap-3">
                    {decodedPhrases.map((phrase, ind) => (
                      <Badge
                        key={ind}
                        variant="outline"
                        className="text-lg border-primary"
                      >
                        {phrase}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-x-3 flex items-center">
                <Button
                  onClick={() => setOtpForShowPhrase(true)}
                  disabled={decoding || deleting}
                >
                  {decoding ? "Retreiving phrases..." : "Retreive phrase"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setOtpForDeletePhrase(true)}
                >
                  Delete from list
                </Button>
                {decodedPhrases.length > 0 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyText(decodedPhrases.join(" "))}
                  >
                    <FaCopy size={20} />
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
