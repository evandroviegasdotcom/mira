"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FormSchema, schema, TaskStatus } from "./schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormField,
  Form as FormComp,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StatusBullet from "../StatusBullet";
import { findUserByEmail } from "@/services/user";
import { User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/image";
import { useProjectContext } from "../../ProvidersWrapper";
import { createTask, CreateTaskData, editTask } from "@/services/task";
import { TaskWithAssignedTo } from "@/types/task";
import { getAuth } from "@/services/auth";

export default function Form({
  onClose,
  task,
}: {
  onClose: () => void;
  task?: TaskWithAssignedTo;
}) {
  const isEditing = !!task;

  const [email, setEmail] = useState(isEditing ? task.assignedTo.email : '');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssignLoading, setIsAssignLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState<null | User>(
    isEditing ? task.assignedTo : null
  );
  const { project } = useProjectContext();
  const { toast } = useToast();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: isEditing
      ? {
          description: task.description,
          dueDate: task.dueDate,
          status: task.status as TaskStatus,
          title: task.title,
        }
      : { status: "starting" },
  });
  const onSubmit = async (data: FormSchema) => {
    if (!assignedTo)
      return toast({ title: "This task must be assigned to somebody!" });
    setIsLoading(true);
    const { user: authedUser } = await getAuth()
    if(!authedUser) return
    const newTaskData = {
      ...data,
      assignedToId: assignedTo.id,
      projectId: project.id,
      createdById: authedUser.sub

    } satisfies CreateTaskData
    if(isEditing) {
      await editTask({ ...newTaskData, id: task.id })
    } else {  
      await createTask(newTaskData);
      toast({ title: "A new task was created!" });
    }
    onClose();
    setIsLoading(false);
  };

  const handleSearch = async () => {
    if(email === assignedTo?.email) return 
    setIsAssignLoading(true);
    const userToAssign = await findUserByEmail(email);
    setIsAssignLoading(false);
    if (!!!userToAssign) return toast({ title: "User was not found!" });
    if (!project.membersIDs.includes(userToAssign.id))
      return toast({ title: "This user is not a member of this project!" });
    setAssignedTo(userToAssign);
  };
  return (
    <FormComp {...form}>
      {assignedTo ? (
        <div className="p-3 px-7 bg-secondary rounded w-full mb-3">
          <p className="font-semibold text-zinc-700 mb-3">Assigned to: </p>
          <div className="mb-6 flex items-center gap-4 ">
            <Image
              width={70}
              height={70}
              src={assignedTo.picture}
              className="rounded-full object-cover"
              alt="Image"
            />
            <div className="flex flex-col gap-1">
              <span className="text-xl font-bold">{assignedTo.name}</span>
              <span className="text-zinc-600 font-semibold">
                {assignedTo.email}
              </span>
            </div>
          </div>
        </div>
      ) : null}
      <form className="space-y-3 grid grid-cols-2 gap-3 w-full">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Walk the dog" {...field} />
              </FormControl>
              <FormDescription>Give a title to your task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date <= new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Give the due date to your task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="starting">
                    <StatusBullet status="starting" />
                  </SelectItem>
                  <SelectItem value="progress">
                    <StatusBullet status="progress" />
                  </SelectItem>
                  <SelectItem value="done">
                    <StatusBullet status="done" />
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex items-center gap-1.5">
          <Input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="py-2"
          />
          <Button
            variant="secondary"
            disabled={email == "" || isAssignLoading}
            onClick={handleSearch}
          >
            <span>Invite</span>
            {isAssignLoading ? (
              <AiOutlineLoading className="animate-spin" />
            ) : null}
          </Button>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description..."
                  id="message"
                  {...field}
                />
              </FormControl>
              <FormDescription>Give a description to your task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 w-full justify-end col-span-2">
          <Button
            disabled={isLoading || isAssignLoading}
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="w-fit"
          >
            <span>{isEditing ? 'Edit' : 'Create'}</span>
            {isLoading ? <AiOutlineLoading className="animate-spin" /> : null}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-fit"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormComp>
  );
}
