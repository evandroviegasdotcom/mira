"use client";
import { TaskWithAssignedToAndProject } from "@/types/task";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import TaskOverview from "../../TaskOverview";
import StatusBullet from "../../StatusBullet";
import { editTask } from "@/services/task";
import { cn } from "@/lib/utils";
import { ViewProps } from ".";

function groupTasksByStatus(tasks: TaskWithAssignedToAndProject[]) {
  return {
    starting: tasks.filter((task) => task.status === "starting"),
    progress: tasks.filter((task) => task.status === "progress"),
    done: tasks.filter((task) => task.status === "done"),
  };
}

export default function Draggable({ tasks, authedUser }: ViewProps) {
  const [tasksGroupedByStatus, setTasksGroupedByStatus] = useState(
    groupTasksByStatus(tasks)
  );
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => { 
    setTasksGroupedByStatus(groupTasksByStatus(tasks));
  }, [tasks]);

  const onDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const onDrop = async (
    e: React.DragEvent,
    newStatus: "starting" | "progress" | "done"
  ) => {
    const taskId = e.dataTransfer.getData("taskId");
    e.dataTransfer.clearData("taskId")
    if (!taskId) return;
    const ungroupedTasks =  [...tasksGroupedByStatus.done, ...tasksGroupedByStatus.progress, ...tasksGroupedByStatus.starting]

    const taskToDrop = ungroupedTasks.find(t => t.id === taskId)
    if(!taskToDrop) return 

    const nTasks = ungroupedTasks.filter(t => t.id !== taskId)
    const nTask = { ...taskToDrop, status: newStatus }
    nTasks.push(nTask)

    const nGroupedStatus = groupTasksByStatus(nTasks)
    setTasksGroupedByStatus(nGroupedStatus)
    setIsLoading(true)
    await editTask({
      description: nTask.description,
      dueDate: nTask.dueDate,
      status: nTask.status,
      title: nTask.title,
      assignedToId: nTask.assignedToId,
      projectId: nTask.projectId,
      id: nTask.id,
    })
    setIsLoading(false)

  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="w-full space-y-2">
      {isLoading ? (
          <span className="small-title text-xs">Saving...</span>
      ): null}
      <div className="flex md:flex-row flex-col gap-4">
        {Object.entries(tasksGroupedByStatus).map(([status, tasks]) => (
          <div
            key={status}
            className="md:w-1/3 bg-secondary p-5 rounded"
            onDrop={(e) =>
              onDrop(e, status as "starting" | "progress" | "done")
            }
            onDragOver={onDragOver}
          >
            <div className="mb-4 pb-4 font-semibold text-zinc-800 border-b">
            <StatusBullet status={status} />

            </div>
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskOverview key={task.id} authedUser={authedUser} task={task}>
                  <div
                    onDragStart={(e) => onDragStart(e, task.id)}
                    draggable={!isLoading}
                    className={cn(
                      "bg-white rounded shadow cursor-move space-y-2 p-3",
                      isLoading && "opacity-70"
                    )}
                  >
                    <span className="block truncate pb-2 font-medium">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <Image
                        src={task.assignedTo.picture}
                        width={25}
                        height={25}
                        className="rounded-full"
                        alt="Image"
                      />
                      <span className="text-sm text-zinc-700 font-medium">
                        {task.assignedTo.name}
                      </span>
                    </div>
                  </div>
                </TaskOverview>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
