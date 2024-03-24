"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import TextFiled from "../_components/TextFiled";
import Select from "../_components/Select";
import TextArea from "../_components/TextArea";


export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("")

  const categories = api.category.getCategories.useQuery(category)

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
      setCategory("");
      setPriority("mid");
      setDescription("");
    },
  });

  const priorityOptions = ["low", "mid", "high"];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTask.mutate({ name, category, priority: priority as "low" | "mid" | "high", description });
      }}
      className="flex flex-col gap-2"
    >

      <TextFiled value={name} onChange={(e) => setName(e.currentTarget.value)} label="Title" required />
      <Select value={category} setValue={setCategory} label="Category" options={categories.data ? categories.data.map((item) => item.name) : []} allowCustom required />
      <Select value={priority} setValue={setPriority} label="Priority" options={priorityOptions} required />
      <TextArea value={description} label="Description" onChange={(e) => setDescription(e.target.value)} />

      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createTask.isPending}
      >
        {createTask.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}