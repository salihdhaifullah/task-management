import { getServerAuthSession } from "~/server/auth";
import Tasks from "./_components/Tasks";
import Link from "next/link";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
      {session?.user ? (
        <Tasks />
      ) : (
        <Link
          href={"/api/auth/signin"}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20">
          Sign in
        </Link>
      )}
    </div>
  );
}