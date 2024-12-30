"use server"

import { User } from "@/types/user";
import { getSession } from "@auth0/nextjs-auth0";

export async function getAuth() {
    const session = await getSession()
    const user = session?.user
    if(!user) return { isLoggedIn: (false as const), user: null }
    return { isLoggedIn: (true as const), user: (user as User) }
}