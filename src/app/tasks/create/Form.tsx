"use client"

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { api } from "~/trpc/react";
import TextFiled from "../../_components/TextFiled";
import Select from "../../_components/Select";
import TextArea from "../../_components/TextArea";
import Button from '../../_components/Button';
import { priorityOptions } from "~/app/utils/priority";


const Form = () => {
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
  
    const handelSubmit = (e: FormEvent) => {
      e.preventDefault();
      createTask.mutate({ name, category, priority: priorityOptions.indexOf(priority) + 1, description });
    }
  
    return (
      <form onSubmit={(e) => handelSubmit(e)} className="flex flex-col gap-2 shadow-md justify-center items-center p-4 rounded-md bg-slate-200">
        <h1 className="text-2xl">Create New Task</h1>
        <TextFiled value={name} onChange={(e) => setName(e.currentTarget.value)} label="Title" required />
        <Select value={category} setValue={setCategory} label="Category" options={categories.data ? categories.data.map((item) => item.name) : []} allowCustom required />
        <Select value={priority} setValue={setPriority} label="Priority" options={priorityOptions} required />
        <TextArea value={description} label="Description" onChange={(e) => setDescription(e.currentTarget.value)} />
  
        <Button isLoading={createTask.isPending} type="submit">Submit</Button>
      </form>
    );
}

export default Form