"use server"

import { prisma } from "@/prisma";
import { CompleteTask } from "@/types/task";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type CreateTaskData = Prisma.TaskCreateArgs["data"]
export async function createTask(data: CreateTaskData) {
    const task = await prisma.task.create({ data })
    revalidatePath(`/app/project/${data.projectId}`, "layout")
    return task
}

export async function getProjectTasks(projectId: string) {
    const tasks = await prisma.task.findMany({
        where: { projectId },
        include: { assignedTo: true, project: true }
    })

    return tasks as CompleteTask[]
}