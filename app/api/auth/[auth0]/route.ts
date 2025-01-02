// app/api/auth/[auth0]/route.js
import { createUser, findUserByEmail } from '@/services/user';
import { handleAuth, handleCallback, handleLogin, Session } from '@auth0/nextjs-auth0';
import { NextRequest } from 'next/server';

// to force the login page to show up
const customHandleLogin = async (req: NextRequest, res) => {
    return handleLogin(req , res, {
        authorizationParams: { prompt: "login" }
    })
}

// it's called every login
const afterCallback = async (req: Request, session: Session) => {
    const { email, name, nickname, picture, sub } = session.user
    const foundUser = await findUserByEmail(email)
    const exists = Boolean(foundUser) 
    if(exists) return session
    await createUser({ email, name, nickname, picture, id: sub })
    return session
}

export const GET = handleAuth({
    login: customHandleLogin,
    callback: handleCallback({ afterCallback })
});