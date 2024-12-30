import { Project, User } from "@prisma/client";

export type ProjectWithMembers = Project & { members: User[] }
export type CompleteProject = Project & { members: User[], owner: User }
export type ProjectWithOwner = Project & { owner: User }