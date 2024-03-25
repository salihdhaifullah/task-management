import { getServerAuthSession } from "~/server/auth";
import Task from "./Task";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/api/auth/signin");

  return <Task id={Number(params.id)}/>
}