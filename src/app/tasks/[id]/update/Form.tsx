"use client"

import { useRouter } from "next/navigation";
import { type FormEvent, useState, useEffect } from "react";
import { api } from "~/trpc/react";
import TextFiled from "../../../_components/TextFiled";
import Select from "../../../_components/Select";
import TextArea from "../../../_components/TextArea";
import Button from '../../../_components/Button';
import { priorityOptions } from "~/app/utils/priority";


const Form = (props: {id: number}) => {
    const router = useRouter();
    const task = api.task.getTask.useQuery(props.id)
  
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("")
    const [priority, setPriority] = useState("")
  
  
    useEffect(() => {
      if (task.data) {
        setName(task.data.name)
        setCategory(task.data.category.name)
        setDescription(task.data.description ?? "")
        setPriority(priorityOptions[task.data.priority-1] ?? "")
      }
    }, [task.data])
    
    const categories = api.category.getCategories.useQuery(category)
  
    const createTask = api.task.updateTask.useMutation({
      onSuccess: () => {
        router.back();
      },
    });
  
  
    const handelSubmit = (e: FormEvent) => {
      e.preventDefault();
      createTask.mutate({ name, category, priority: priorityOptions.indexOf(priority) + 1, description, id: props.id });
    }
  
    return (
      <form onSubmit={(e) => handelSubmit(e)} className="flex flex-col gap-2 shadow-md justify-center items-center p-4 rounded-md bg-slate-200">
        <h1 className="text-2xl">Update Task</h1>
        <TextFiled value={name} onChange={(e) => setName(e.currentTarget.value)} label="Title" required />
        <Select value={category} setValue={setCategory} label="Category" options={categories.data ? categories.data.map((item) => item.name) : []} allowCustom required />
        <Select value={priority} setValue={setPriority} label="Priority" options={priorityOptions} required />
        <TextArea value={description} label="Description" onChange={(e) => setDescription(e.target.value)} />
  
        <Button isLoading={createTask.isPending} type="submit">Submit</Button>
      </form>
    );
}

export default Form