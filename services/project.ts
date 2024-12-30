"use server"

import { prisma } from "@/prisma";
import type { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

type CreateProject = Prisma.ProjectCreateArgs["data"]
type EditProject = Prisma.ProjectUpdateArgs["data"]
export async function createProject(data: CreateProject) {
    const { membersIDs, ...rest }  = data
    const project = await prisma.project.create({
        data: {
            ...rest,
            membersIDs,
            members: {
                connect: (membersIDs as []).map(id => ({ id }))
            }
        },
        include: {
            owner: true,
            members: true
        }
    })
    return project
}

export async function editProject(data: EditProject) {

    const project = await prisma.project.update({
        where: { id: (data.id as string) },
        data: {
            ...data,
            members: {
                set: (data.membersIDs as []).map(id => ({ id }))
            }
        }
    })
    return project
}

export async function deleteProject(projectId: string) {
    await prisma.project.delete({ where: { id: projectId } })
    revalidatePath("/app", "layout")
}

export async function getUserProjects(userId: string) {
    const projects = await prisma.project.findMany({
        where: {
            OR: [{ ownerID: userId }, { membersIDs: { has: userId } }]
        },
        include: {
            members: true
        }
    })
    return projects
}

export async function getProject(projectId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
            members: true,
            owner: true
        }
    })
    return project
}