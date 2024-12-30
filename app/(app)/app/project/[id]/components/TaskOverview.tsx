"use client";
import {  TaskWithAssignedToAndProject } from "@/types/task";
import { format } from "date-fns";
import React, { useState } from "react";
import StatusBullet from "./StatusBullet";
import { Button } from "@/components/ui/button";
import Form from "./tasks/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "@/types/user";
import { deleteTask } from "@/services/task";

export default function TaskOverview({
  task,
  children,
  authedUser
}: {
  task: TaskWithAssignedToAndProject;
  children: React.ReactNode;
  authedUser: User
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Popover key={task.id}>
      <PopoverTrigger className="" asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-fit">
        <>
          {isEditing ? (
            <Form task={task} onClose={() => setIsEditing(false)} />
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="block text-2xl font-semibold">
                  {task.title}
                </span>
                <p className="text-sm text-zinc-800 font-medium">
                  {task.description}
                </p>
              </div>
              <div className="h-[1px] w-full bg-secondary" />
              <div className="space-y-2 text-sm font-medium text-zinc-600">
                <div className="flex items-center gap-2 ">
                  <p className="">Assigned to: </p>
                  <span>{task.assignedTo.name}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <p className="">Due Date: </p>
                  <span>{format(task.dueDate, "PPP")}</span>
                </div>
                <div className="flex items-center gap-2 ">
                  <p className="">Status: </p>
                  <StatusBullet status={task.status} />
                </div>
              </div>

            {task.createdById === authedUser.sub || task.project.ownerID === authedUser.sub ? (
                <div className="flex gap-1 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id, task.projectId)}>Delete</Button>
              </div>
            ) : null}
            </div>
          )}
        </>
      </PopoverContent>
    </Popover>
  );
}
