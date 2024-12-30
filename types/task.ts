import { Task, User } from "@prisma/client";
import { ProjectWithOwner } from "./project";

export type TaskWithAssignedTo = Task & { assignedTo: User }
export type TaskWithAssignedToAndProject = TaskWithAssignedTo & { project: ProjectWithOwner } 