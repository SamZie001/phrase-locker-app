"use client";
import { useState } from "react";
import userContext from "@/hooks/useUserContext";
import { useApiMutate } from "@/hooks/useApiRequests";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IoReload } from "react-icons/io5";
import { Badge } from "@/components/ui/badge";
import { FaPlus } from "react-icons/fa";

export default function Home() {
  const { user } = userContext();
  const [walletName, setWalletName] = useState<string>("");
  const [walletEmail, setWalletEmail] = useState<string>("");
  const [wordCount, setWordCount] = useState<string>("1");
  const [currentEntry, setCurrentEntry] = useState<string>("");
  const [secretPhrases, setSecretPhrases] = useState<string[]>([]);
  const {
    data,
    isPending: loading,
    error,
    mutate: handleSubmit,
  } = useApiMutate(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/secrets/create-secret/${user}`,
    "POST",
    ["secrets"]
  );

  const addEntry = () => {
    if (currentEntry.length) {
      setSecretPhrases((prev) => [...prev, ...currentEntry.trim().split(" ")]);
      setCurrentEntry("");
    }
  };

  const removeEntry = (index: number) => {
    const filter = secretPhrases.filter((items, ind) => ind !== index);
    setSecretPhrases(filter);
  };

  return (
    <main className="container space-y-6">
      <div className="header-text">
        <h1>Create Secret</h1>
        <p>Add a new secret to your list!</p>
      </div>

      <div className="bordered-container">
        <form
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({ walletName, walletEmail, wordCount, secretPhrases });
          }}
          className="w-full md:w-[400px] mx-auto space-y-3 px-4 pb-4"
        >
          <div className="space-y-1">
            <Label>Wallet Name</Label>
            <Input
              required
              type="text"
              onChange={(e) => setWalletName(e.target.value)}
              value={walletName}
              disabled={loading}
            />
            {error?.response?.data?.walletName && (
              <p className="text-red-500 text-xs">
                {error?.response?.data?.walletName}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Wallet Email</Label>
            <Input
              required
              type="email"
              onChange={(e) => setWalletEmail(e.target.value)}
              value={walletEmail}
              disabled={loading}
            />
            {error?.response?.data?.walletEmail && (
              <p className="text-red-500 text-xs">
                {error?.response?.data?.walletEmail}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Word Count</Label>
            <p className="text-muted-foreground text-xs">
              This is the number of words in your phrase
            </p>
            <Input
              required
              type="number"
              min={1}
              onKeyDown={(evt) =>
                ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()
              }
              onChange={(e) => setWordCount(e.target.value)}
              value={wordCount}
              disabled={loading}
            />
            {error?.response?.data?.wordCount && (
              <p className="text-red-500 text-xs">
                {error?.response?.data?.wordCount}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Secret Phrases</Label>

            <p className="text-muted-foreground text-xs">
              These phrases will be encrypted and are securely stored
            </p>

            <p className="text-xs text-primary">
              Add words individually or user <strong>space</strong> separated
              words at a go
            </p>

            <div className="flex gap-3">
              <Input
                type="text"
                onChange={(e) => setCurrentEntry(e.target.value)}
                value={currentEntry}
                disabled={loading}
              />
              <Button
                disabled={loading}
                size="icon"
                onClick={addEntry}
                type="button"
              >
                <FaPlus />
              </Button>
            </div>

            <p className="text-muted-foreground text-xs">
              Click the added words to remove them from the phrase list
            </p>

            <div className="flex flex-wrap gap-1">
              {secretPhrases.map((phrase, ind) => (
                <Badge
                  key={ind}
                  onClick={() => removeEntry(ind)}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  {phrase}
                </Badge>
              ))}
            </div>

            {error?.response?.data?.secretPhrases && (
              <p className="text-red-500 text-xs">
                {error?.response?.data?.secretPhrases}
              </p>
            )}
          </div>

          <Button
            variant="default"
            size="lg"
            type="submit"
            className="w-full"
            disabled={
              loading ||
              !walletName.length ||
              !walletEmail.length ||
              !wordCount.length ||
              !secretPhrases.length
            }
          >
            {loading && <IoReload className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Adding secret to list.." : "Add"}
          </Button>
        </form>
      </div>
    </main>
  );
}
