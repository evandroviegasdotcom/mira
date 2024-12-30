"use server"

import { prisma } from "@/prisma"
import { Prisma } from "@prisma/client"


type CreateUserData = Prisma.UserCreateArgs["data"] 
export async function findUserByEmail(email: string) {
    const res = await prisma.user.findUnique({
        where: { email }
    })
    return res
}

export async function createUser(data: CreateUserData) {
    const res = await prisma.user.create({ data })
    return res
}

