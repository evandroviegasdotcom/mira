"use server"
import { prisma } from "@/prisma";
import { Prisma } from "@prisma/client";

type Data = Prisma.UserCreateArgs["data"];
export async function findUserByEmail(email: string) {
  const res = await prisma.user.findUnique({
    where: { email },
  });
  return res;
}

export async function createUser(data: Data) {
  const res = await prisma.user.create({
    data,
  });
  return res;
}

