"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {  TaskWithAssignedToAndProject } from "@/types/task";
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  startOfMonth,
} from "date-fns";
import Image from "next/image";
import { useState } from "react";
import TaskOverview from "../../TaskOverview";
import { ViewProps } from ".";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function Calendar({ tasks, authedUser }: ViewProps) {
  const currDate = new Date();
  const [month, setMonth] = useState(currDate.getMonth());
  const [year, setYear] = useState(currDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(currDate.getDate());

  const selectedDate = new Date(year, month, selectedDay);
  const firstDayOfMonth = startOfMonth(selectedDate);
  const lastDayOfMonth = endOfMonth(selectedDate);
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });
  const startingDayIdx =
    getDay(firstDayOfMonth) - 1 < 0 ? 6 : getDay(firstDayOfMonth) - 1; // Adjust for Monday start
  const dClassName = "hover:bg-secondary transition-all px-4 py-1 rounded-full";
  const tasksGroupedByDate = tasks.reduce(
    (acc: Record<string, TaskWithAssignedToAndProject[]>, task) => {
      const dateKey = format(task.dueDate, "PPP");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(task);
      return acc;
    },
    {}
  );
  return (
    <div className="mt-12">
      <div className="space-x-2 mb-8">
        <span className="font-medium">Select:</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">{year ? year : "Select a year"}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto py-1 px-0 space-y-3" align="start">
            {Array.from({ length: 5 }).map((_, idx) => {
              const y = currDate.getFullYear() - (6 - (idx + 1));
              return (
                <div
                  key={idx}
                  className={dClassName}
                  onClick={() => setYear(y)}
                >
                  {y}
                </div>
              );
            })}
            <div
              className={dClassName}
              onClick={() => setYear(currDate.getFullYear())}
            >
              {currDate.getFullYear()}
            </div>
            {Array.from({ length: 5 }).map((_, idx) => {
              const y = currDate.getFullYear() + (idx + 1);
              return (
                <div
                  key={idx}
                  className={dClassName}
                  onClick={() => setYear(y)}
                >
                  {y}
                </div>
              );
            })}
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="secondary">{months[month]}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto py-1 px-0 space-y-3" align="start">
            {months.map((m, idx) => (
              <div key={m} className={dClassName} onClick={() => setMonth(idx)}>
                {m}
              </div>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid md:grid-cols-7 grid-cols-2   gap-1">
        {weekDays.map((w) => (
          <span className="font-medium hidden md:inline" key={w}>
            {w}
          </span>
        ))}
        {Array.from({ length: startingDayIdx }).map((_, idx) => (
          <div className="bg-secondary/60 min-h-44" key={idx} />
        ))}
        {daysInMonth.map((date) => (
          <div
            key={date.toISOString()}
            className="bg-secondary  relative flex items-end p-1 min-h-44 h-full"
            onClick={() => setSelectedDay(date.getDate())}
          >
            <div className="space-y-1 w-full">
              {(tasksGroupedByDate[format(date, "PPP")] || []).map((task) => (
                <TaskOverview authedUser={authedUser} task={task} key={task.id}>
                  <div className="bg-white rounded shadow  p-2 text-sm">
                    <span className="block truncate font-medium text-left">
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Image
                        src={task.assignedTo.picture}
                        width={20}
                        height={20}
                        className="rounded-full"
                        alt="Assigned"
                      />
                      <span className="text-xs w-full text-zinc-700 font-medium">
                        {task.assignedTo.name}
                      </span>
                    </div>
                  </div>
                </TaskOverview>
              ))}
            </div>
            <div
              className={cn(
                "absolute top-4 right-4 w-6 h-6 text-xs flex justify-center items-center rounded p-2 shadow",
                isToday(date)
                  ? "bg-primary text-white"
                  : "bg-white text-zinc-600"
              )}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
