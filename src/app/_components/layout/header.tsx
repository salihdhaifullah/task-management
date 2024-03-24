import { getServerAuthSession } from "~/server/auth";

export default async function Header() {
    const session = await getServerAuthSession();
    return (
        <header className="flex flex-col justify-center items-center text-blue-700 bg-slate-300 rounded-md p-2">
            <p>{session?.user.name}</p>
        </header>
    )
}