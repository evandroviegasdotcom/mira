export const revalidate = 0

import { getProjectTasks } from "@/services/task";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Table from "./table";
import Calendar from "./calendar";
import Draggble from "./draggble";
import { getAuth } from "@/services/auth";
import { User } from "@/types/user";
import { TaskWithAssignedToAndProject } from "@/types/task";


export type ViewProps = { tasks: TaskWithAssignedToAndProject[], authedUser: User }
type Props = { projectId: string };
export  default async function Views({ projectId }: Props) {
  const tasks = await getProjectTasks(projectId);
  const { user: authedUser } = await getAuth()
  if(!authedUser) return
  return (
    <Tabs defaultValue="table">
      <TabsList>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="draggble">Draggble</TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <Table tasks={tasks} authedUser={authedUser} />
      </TabsContent>
      <TabsContent value="calendar">
        <Calendar tasks={tasks} authedUser={authedUser} />
      </TabsContent>
      <TabsContent value="draggble">
        <Draggble tasks={tasks} authedUser={authedUser} />
      </TabsContent>
    </Tabs>
  );
}
