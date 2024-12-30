import {
  TableBody,
  TableCaption,
  TableCell,
  Table as TableComp,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CompleteTask } from "@/types/task";
import { User } from "@/types/user";
import React from "react";
import StatusBullet from "../../status-bullet";
import Image from "next/image";
import { format } from "date-fns";
import { ViewProps } from ".";

export default function Table({
  tasks,
  authedUser,
}: ViewProps) {
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
            <TableCell>{task.title}</TableCell>
            <TableCell>
              <StatusBullet status={task.status} />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5">
                <Image
                  src={task.assignedTo.picture}
                  width={30}
                  height={30}
                  className="rounded-full hidden md:inline"
                  alt="Avatar"
                />
                <span className="text-xs md:text-md md:font-semibold">
                  {task.assignedTo.name}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-xs md:text-md">
              {format(task.dueDate, "PPP")}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableComp>
  );
}
