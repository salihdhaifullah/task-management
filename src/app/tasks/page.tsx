import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import Tasks from "./Tasks";

export default async function Page() {
    const session = await getServerAuthSession();
    if (!session?.user) redirect("/api/auth/signin");

    return <Tasks />
}


