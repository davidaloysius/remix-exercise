import { createCookieSessionStorage } from "@remix-run/node"; // or cloudflare/deno
import { PostPayload } from "./posts.server";

type SessionData = {
  payload: PostPayload;
};

type SessionFlashData = {
  error: string;
};

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__profile",
    },
  });

export { getSession, commitSession, destroySession };
