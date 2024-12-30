"use server"
import { prisma } from "@/prisma";
import { TaskWithAssignedToAndProject } from "@/types/task";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export type CreateTaskData = Prisma.TaskCreateArgs["data"]
export async function createTask(data: CreateTaskData) {
    const task = await prisma.task.create({ data })
    revalidatePath(`/app/project/${data.projectId}`, "layout")
    return task
}

export async function deleteTask(taskId: string, projectId: string) {
    await prisma.task.delete({ where: { id: taskId } })
    revalidatePath(`/app/project/${projectId}`, "layout")

}
export async function getProjectTasks(projectId: string) {
    const tasks = await prisma.task.findMany({
        where: { projectId },
        include: { assignedTo: true, project: true },
    })
    revalidatePath(`/app/project/${projectId}`, "layout")
    return tasks as TaskWithAssignedToAndProject[]
}

export async function deleteProjectTasks(projectId: string) {
    await prisma.task.deleteMany({ where: { projectId } })
}
export async function editTask(data: CreateTaskData) {
    const project = await prisma.task.update({
        where: { id: data.id },
        data
    })
    revalidatePath(`/app/project/${data.projectId}`, "layout")
    return project
}