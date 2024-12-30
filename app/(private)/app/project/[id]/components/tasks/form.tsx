"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form as FormComp,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import StatusBullet from "../status-bullet";
import { AiOutlineLoading } from "react-icons/ai";
import { findUserByEmail } from "@/services/user";
import { useToast } from "@/hooks/use-toast";
import { Project, User } from "@prisma/client";
import Image from "next/image";
import { getAuth } from "@/services/auth";
import { createTask, CreateTaskData } from "@/services/task";

const formSchema = z.object({
  title: z.string(),
  dueDate: z.date(),
  status: z.string(),
  description: z.string(),
});

export default function Form({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "starting",
    },
  });
  const [email, setEmail] = useState("");
  const [isAssignLoading, setIsAssignLoading] = useState(false);
  const [assignedTo, setAssignedTo] = useState<null | User>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (email === assignedTo?.email) return;
    setIsAssignLoading(true);
    const userToAssign = await findUserByEmail(email);
    setIsAssignLoading(false);
    console.log("userToassign: ", userToAssign);
    if (!userToAssign) return toast({ title: "User was not found!" });
    if (
      !project.membersIDs.includes(userToAssign.id) &&
      project.ownerID !== userToAssign.id
    ) {
      return toast({ title: "This user is not a member of this project!" });
    }
    setAssignedTo(userToAssign);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!assignedTo)
      return toast({ title: "This task must be assigned to somebody" });
    setIsLoading(true);
    const { user: authedUser } = await getAuth();
    if (!authedUser) return;
    const taskData = {
      ...values,
      assignedToId: assignedTo.id,
      projectId: project.id,
      createdById: authedUser.sub,
    } satisfies CreateTaskData;
    await createTask(taskData);
    toast({ title: "A new task was created!" });

    onClose();
    setIsLoading(false);
  }

  return (
    <FormComp {...form}>
      {assignedTo ? (
        <div className="p-3 px-7 bg-secondary rounded w-full mb-3">
          <p className="font-semibold text-zinc-700 mb-3">Assigned to:</p>
          <div className="mb-6 flex items-center gap-4">
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

      <form>
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Walk the dog"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>Give a title to your task</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-6 ">
         
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col relative group">
                  <FormLabel>Due Date</FormLabel>
                    <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
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
                      <Calendar
                        mode="single"
                        className="absolute top-4 bg-white opacity-0 group-hover:opacity-100 shadow rounded"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= new Date()}
                        initialFocus
                      />
                  <FormDescription>
                    Give the due date to your task
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel></FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex items-center gap-1.5 col-span-6">
            <Input
              type="email"
              className="py-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              variant="secondary"
              type="button"
              disabled={!email || isAssignLoading}
              onClick={handleSearch}
            >
              <span>Invite</span>
              {isAssignLoading ? (
                <AiOutlineLoading className="animate-spin" />
              ) : null}
            </Button>
          </div>
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description..."
                  id="message"
                  {...field}
                />
              </FormControl>
              <FormDescription>Give a title to your task</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 w-full justify-end col-span-2">
          <Button
            type="submit"
            className="w-fit"
            disabled={isLoading || isAssignLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            Submit
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
