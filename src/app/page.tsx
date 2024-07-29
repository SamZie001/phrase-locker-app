"use client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import userContext from "@/hooks/useUserContext";
import { useApiFetch } from "@/hooks/useApiRequests";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { CiSquarePlus } from "react-icons/ci";
import { FaPlus } from "react-icons/fa6";

interface WalletI {
  _id: string;
  walletName: string;
  walletEmail: string;
  wordCount: string;
}

export default function Home() {
  const { user } = userContext();
  const { data, isPending, error, refetch } = useApiFetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/secrets/get-secrets/${user}`,
    ["secrets"]
  );

  return (
    <main className="container space-y-6">
      <div className="header-text">
        <h1>Your Phrases</h1>
        <p>Open phrases to manage them</p>
      </div>

      <div className="bordered-container">
        {isPending && <Loading />}

        {!isPending && error && !data && (
          <div className="flex flex-col items-center gap-3">
            <p>Something went wrong</p>
            <Button onClick={() => refetch()}>Retry</Button>
          </div>
        )}

        {!isPending && data && data.data.length == 0 && (
          <div className="flex flex-col items-center gap-3">
            <p>Your list is empty!</p>
            <Button asChild>
              <Link href="/secret/create" className="space-x-1">
                <CiSquarePlus size={25} /> <p>Add a new secret</p>
              </Link>
            </Button>
          </div>
        )}

        {!isPending && data && data.data.length > 0 && (
          <ul className="space-y-3 w-full">
            {data.data.map((wallet: WalletI) => (
              <li
                key={wallet._id}
                className="rounded-lg overflow-hidden shadow-md border border-secondary hover:bg-primary-foreground bg-white"
              >
                <Link
                  href={`/secret/${wallet._id}`}
                  className="w-full space-y-2 flex flex-col items-start md:flex-row md:justify-between p-3"
                >
                  <div>
                    <h3 className="uppercase font-bold text-lg text-primary">
                      {wallet.walletName}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {wallet.walletEmail}
                    </p>
                  </div>
                  <Badge className="uppercase ml-auto" variant="secondary">
                    {wallet.wordCount} words
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button
        asChild
        size="icon"
        className="fixed bottom-5 right-5 z-50 rounded-xl"
      >
        <Link href="/secret/create" className="space-x-1">
          <FaPlus size={25} />
        </Link>
      </Button>
    </main>
  );
}
