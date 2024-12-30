import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import Table from "./table";
import { getProjectTasks } from "@/services/task";
import { getAuth } from "@/services/auth";
import Calendar from "./calendar";
import { CompleteTask } from "@/types/task";
import { User } from "@/types/user";

export type ViewProps = {
  tasks: CompleteTask[];
  authedUser: User;
}
export default async function Views({ projectId }: { projectId: string }) {
  const tasks = await getProjectTasks(projectId);
  const { user: authedUser } = await getAuth();
  if (!authedUser) return null;
  return (
    <Tabs defaultValue="calendar">
      <TabsList>
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="calendar">Calendar</TabsTrigger>
        <TabsTrigger value="draggble">Draggble</TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <Table authedUser={authedUser} tasks={tasks} />
      </TabsContent>

      <TabsContent value="calendar">
        <Calendar authedUser={authedUser} tasks={tasks} />
      </TabsContent>
      <TabsContent value="Draggble">Draggble</TabsContent>
    </Tabs>
  );
}
