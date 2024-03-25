import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export default async function Header() {
    const session = await getServerAuthSession();
    return (
        <header className="flex text-gray-800 bg-gray-300 p-2">
            {session?.user ? (
                <div className="flex flex-row w-full justify-between items-center">
                    <Link href="/tasks" className="rounded-full px-4 py-2 font-semibold no-underline transition hover:bg-slate-200">Tasks</Link>
                    <Link href="/tasks/create" className="rounded-full px-4 py-2 font-semibold no-underline transition hover:bg-slate-200">
                        Create Task
                    </Link>
                    <Link
                        href={"/api/auth/signout"}
                        className="rounded-full px-4 py-2 font-semibold no-underline transition hover:bg-slate-200">
                        Sign out
                    </Link>
                </div>
            ) : (
                <div>
                    <Link
                        href="/api/auth/signin"
                        className="rounded-full px-4 py-2 font-semibold no-underline transition hover:bg-slate-200">
                        Sign in
                    </Link>
                </div>
            )}
        </header>
    )
}