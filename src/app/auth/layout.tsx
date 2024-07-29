export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-[85vh] flex items-center justify-center py-6">
      {children}
    </main>
  );
}
