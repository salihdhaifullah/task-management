"use client"

import Link from "next/link";
import { MdDelete, MdEdit } from "react-icons/md";
import CircleProgress from "~/app/_components/CircleProgress";
import { getPriority, priorityColor } from "~/app/utils/priority";
import { api } from "~/trpc/react";
import formatDate from "~/app/utils/date";
import { useRouter } from "next/navigation";

const Task = (props: { id: number }) => {
  const router = useRouter()

  const deleteTaskMutation = api.task.deleteTask.useMutation({
    onSuccess: () => {
      router.back()
    }
  })
  const task = api.task.getTask.useQuery(props.id)

  const handelDelete = () => {
    deleteTaskMutation.mutate(props.id)
  }

  return task.isPending ? <CircleProgress size="lg" /> : !task.data ? null : (
    <div className="flex p-12 w-full">
      <div className="border rounded-md w-full p-4 flex flex-row justify-between">
        <div className='flex-1 flex gap-2 flex-col'>

          <div className='flex flex-row  justify-between'>
            <h1 className="text-2xl font-semibold">{task.data.name}</h1>
            <div className='flex flex-row gap-4'>
              <MdDelete className='hover:bg-slate-300 p-1 text-3xl rounded-md cursor-pointer' onClick={() => handelDelete()} />
              <Link href={`/tasks/${task.data.id}/update`}>
                <MdEdit className='hover:bg-slate-300 p-1 text-3xl rounded-md cursor-pointer' />
              </Link>
            </div>
          </div>

          <p className="text-gray-700 text-lg">{task.data.category.name}</p>
          <p className="text-gray-500 text-sm break-all">{task.data.description}</p>
          <p className={priorityColor(task.data.priority)}>{getPriority(task.data.priority)}</p>
          <p className="text-gray-500 text-base">{formatDate(task.data.createdAt)}</p>

        </div>
      </div>
    </div>
  )
}

export default Task