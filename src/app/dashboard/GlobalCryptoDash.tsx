import GlobalSearch from "@/components/GlobalSearch";

export default function GlobalCryptoDash() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Global Search</h1>
      <p className="text-muted-foreground">
        Explore coins, wallets, and users across the platform.
      </p>
      <GlobalSearch />
    </main>
  );
}