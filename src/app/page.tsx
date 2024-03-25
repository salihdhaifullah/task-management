import Link from "next/link";
import Button from "./_components/Button";
import { redirect } from 'next/navigation';
import { getServerAuthSession } from "~/server/auth";

export default async function Home() {
  const session = await getServerAuthSession();
  if (session?.user) redirect("/tasks");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Welcome to Task Manager</h1>

      <p className="text-lg text-gray-600 mb-8 text-center">Stay organized and boost your productivity with our task management app.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Manage Your Tasks</h2>
          <p className="text-gray-600">Create, update, and delete tasks easily. Keep track of your progress and stay organized.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Set Priorities</h2>
          <p className="text-gray-600">Assign priorities to your tasks to focus on what matters most. Filter tasks based on priority levels.</p>
        </div>

        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Organize by Categories</h2>
          <p className="text-gray-600">Organize your tasks into categories for better organization and workflow. Create custom categories to suit your needs.</p>
        </div>
      </div>


      <div className="flex justify-center items-center flex-col py-12">
        <Link href="/api/auth/signin">
          <Button buttonSize="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
}