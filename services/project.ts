"use server";
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { deleteProjectTasks } from "./task";

type CreateProject= Prisma.ProjectCreateArgs["data"]

export async function createProject(data: CreateProject) {
  const { membersIDs, ...rest } = data;
  const project = await prisma.project.create({
    data: {
      ...rest,
      membersIDs,
      members: {
        connect: (membersIDs as []).map(id => ({ id })),
      },
    },
    include: {
      owner: true,
      members: true,
    },
  });
  return project;
}

export async function editProject(data: CreateProject) {
  const { membersIDs, ...rest } = data;

  const project = await prisma.project.update({
    where: { id: rest.id },
    data: {
      ...rest,
      membersIDs,
      members: {
        set: (membersIDs as []).map(id => ({ id })),
      },
    },
    include: {
      owner: true,
      members: true,
    },
  });

  return project;
}

export async function deleteProject(projectId: string) {
await deleteProjectTasks(projectId)
  await prisma.project.delete({ where: { id: projectId } })
  revalidatePath("/app", "layout")
}
export async function getUserProjects(userID: string, take?: number) {
  const projects = await prisma.project.findMany({
    where: {
      OR: [{ membersIDs: { has: userID } }, { ownerID: userID }],
    },

    // only add when create sidebar project options dropdown
    include: {
      members: true
    },
    take
  });
  return projects;
}


export async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      members: true,
      owner: true
    },
  })
  return project
}