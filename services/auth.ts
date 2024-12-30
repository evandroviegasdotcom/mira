"use server"

import { User } from "@/types/user"
import { getSession } from "@auth0/nextjs-auth0"

type GetAuthReturn = {
    isLoggedIn: false 
    user: null
} | {
    isLoggedIn: true 
    user: User
}

export async function getAuth(): Promise<GetAuthReturn> {
    const session = await getSession()
    const user = session?.user
    if(!user) return { isLoggedIn: false, user: null }
    return { isLoggedIn: true, user: (user as User) }
}