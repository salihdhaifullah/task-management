import { getServerAuthSession } from "~/server/auth";
import Form from "./Form";
import { redirect } from "next/navigation";


export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerAuthSession();
  if (!session?.user) redirect("/api/auth/signin");

  return <Form id={Number(params.id)}/>
}