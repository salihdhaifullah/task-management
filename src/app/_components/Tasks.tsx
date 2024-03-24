"use client"

import { api } from '~/trpc/react'
import formatDate from '~/utils/date'
import CircleProgress from './CircleProgress'
import React, { useState } from 'react';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useRouter } from 'next/navigation';

const priorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return 'text-green-600';
    case "mid":
      return 'text-yellow-600';
    case "high":
      return 'text-red-600';
    default:
      return '';
  }
};

const Tasks = () => {
  const tasks = api.task.getTasks.useQuery()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      {tasks.isLoading ? <CircleProgress />
        : !tasks.data ? null
          : tasks.data.map((task) => <Task task={task} key={task.id} />)}
    </div>
  );
};



export default Tasks

interface ITaskProps {
  category: {
    name: string;
  };
  name: string;
  description: string | null;
  priority: string;
  id: number;
  completed: boolean;
  createdAt: Date;
}

const Task = (props: { task: ITaskProps }) => {
  const [completed, setCompleted] = useState(props.task.completed);
  const [isDeleted, setIsDeleted] = useState(false)
  const completionStateMutation = api.task.updateCompletionState.useMutation()
  const deleteTaskMutation = api.task.deleteTask.useMutation()

  const handelDelete = () => {
    setIsDeleted(true)
    deleteTaskMutation.mutate(props.task.id)
  }

  const handleCompletionChange = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted); 
    completionStateMutation.mutate({ id: props.task.id, completion: newCompleted });
  }

  const router = useRouter()

  return isDeleted ? null : (
    <div className="border rounded-md p-4 mb-4 flex flex-row justify-between">
      <div className='flex-1'>
        <h2 className="text-2xl font-semibold">{props.task.name}</h2>
        <p className="text-gray-700 text-lg">{props.task.category.name}</p>
        <p className="text-gray-500 break-all">{props.task.description}</p>
        <p className={priorityColor(props.task.priority)}>{props.task.priority}</p>
        <p className="text-sm text-gray-500">{formatDate(props.task.createdAt)}</p>
      </div>

      <div className='flex-col flex-2 flex'>
        <div className='flex flex-row gap-2 h-full justify-start'>
          <MdDelete className='hover:bg-slate-300 p-1 text-3xl rounded-md cursor-pointer' onClick={() => handelDelete()} />
          <MdEdit className='hover:bg-slate-300 p-1 text-3xl rounded-md cursor-pointer' onClick={() => router.push(`/update/${props.task.id}`)} />
        </div>

        <div className='flex justify-center items-center w-full h-full'>
          <input type="checkbox" checked={completed} onChange={() => handleCompletionChange()} className="ml-2 text-4xl w-8 h-8" />
        </div>

      </div>
    </div>
  )
}