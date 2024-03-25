"use client"

import { api } from '~/trpc/react'
import React, { useState } from 'react';
import Link from 'next/link';
import CircleProgress from '../_components/CircleProgress';
import { getPriority, priorityColor, priorityOptions } from '~/app/utils/priority';
import SelectButton from '../_components/SelectButton';

const Tasks = () => {
  const [category, setCategory] = useState("--all--")
  const [priority, setPriority] = useState("--all--")
  const [completed, setCompleted] = useState("--all--")

  const tasks = api.task.getTasks.useQuery({ category, priority, completed })
  const categories = api.category.getCategories.useQuery()

  return (
    <div className="flex flex-col gap-4 w-full px-4 py-16">
      {tasks.isLoading ? <CircleProgress size='lg'/>
        : !tasks.data ? null
          : (
            <div className='flex flex-col w-full'>
              <div className='flex flex-row justify-start gap-4 py-4'>
                {categories.data ? (
                  <SelectButton value={category} setValue={setCategory} options={[...categories.data.map((item) => item.name), "--all--"]} label='Category' />
                ) : null}
                <SelectButton value={priority} setValue={setPriority} options={[...priorityOptions, "--all--"]} label='Priority' />
                <SelectButton value={completed} setValue={setCompleted} options={["completed", "uncompleted", "--all--"]} label='Completed' />
              </div>

              {tasks.data.map((task) => <Task task={task} key={task.id} />)}
            </div>
          )}
    </div>
  );
};



export default Tasks

interface ITaskProps {
  category: {
    name: string;
  };
  name: string;
  priority: number;
  id: number;
  completed: boolean;
}

const Task = (props: { task: ITaskProps }) => {
  const [completed, setCompleted] = useState(props.task.completed);
  const completionStateMutation = api.task.updateCompletionState.useMutation()

  const handleCompletionChange = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted);
    completionStateMutation.mutate({ id: props.task.id, completion: newCompleted });
  }

  return (
    <div className="border rounded-md p-4 mb-4 flex flex-row justify-between">
      <div className='flex-1'>
        <Link className="text-2xl font-semibold underline text-blue-500" href={`/tasks/${props.task.id}`}>{props.task.name}</Link>
        <p className="text-gray-700 text-lg">{props.task.category.name}</p>
        <p className={priorityColor(props.task.priority)}>{getPriority(props.task.priority)}</p>
      </div>

      <div className='flex-col flex-2 flex justify-center items-center '>
        <input type="checkbox" checked={completed} onChange={() => handleCompletionChange()} className="ml-2 text-4xl w-8 h-8" />
      </div>
    </div>
  )
}