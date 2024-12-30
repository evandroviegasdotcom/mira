import React from "react";
import {
  Table as TableComp,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import StatusBullet from "../../StatusBullet";
import { TaskStatus } from "../schema";
import Image from "next/image";
import { format } from "date-fns";
import TaskOverview from "../../TaskOverview";
import { ViewProps } from ".";

export default function Table({ tasks, authedUser }: ViewProps) {
  return (
    <TableComp>
      <TableCaption>A list of project tasks</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="md:w-[200px]">Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assigned To</TableHead>
          <TableHead>Due Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TaskOverview authedUser={authedUser} task={task}>
              <TableCell className="font-medium hover:underline truncate w-fit">
                {task.title}
              </TableCell>
            </TaskOverview>
            <TableCell>
              <StatusBullet status={task.status as TaskStatus} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Image
                  width={30}
                  height={30}
                  className="rounded-full hidden md:inline"
                  src={task.assignedTo.picture}
                  alt="Avatar"
                />
                <span className="text-xs md:text-md md:font-semibold ">{task.assignedTo.name}</span>
              </div>
            </TableCell>
            <TableCell className="text-xs md:text-md">{format(task.dueDate, "PPP")}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableComp>
  );
}
