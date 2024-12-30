import { createUser , findUserByEmail } from '@/services/user';
import { User } from '@/types/user';
import { handleAuth, handleCallback, Session, handleLogin } from '@auth0/nextjs-auth0';

// Custom login handler to include prompt=login
const customHandleLogin = async (req, res) => {
    const options = {
        authorizationParams: {
            prompt: 'login',
        },
    };
    return handleLogin(req, res, options);
};

const afterCallback = async (req: Request, session: Session) => {
    const { email, name, nickname, picture, sub } = session.user as User;
    const exists = Boolean(await findUserByEmail(email));
    if (exists) return session;

    await createUser ({ email, name, id: sub, nickname, picture });
    return session;
};

export const GET = handleAuth({
    login: customHandleLogin, // Use the custom login handler
    callback: handleCallback({ afterCallback }),
});