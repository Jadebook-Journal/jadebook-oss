import configureOpenAPI from "@backend/configure-open-api";
import createApp from "@backend/create-app";
import { authMiddleware } from "@backend/middlewares/auth";
import index from "@backend/routes/index.route";
import profile from "@backend/routes/profile/profile.index";
import { handle } from "hono/vercel";

export const runtime = "edge";

const app = createApp();

configureOpenAPI(app);

// this is for the OpenAPI spec and reference — we don't want it locked behind auth
app.route("/", index);

// Apply an auth check for all main routes
app.use("/v1/", authMiddleware);

// add all the other routes
const routes = [profile] as const;

routes.forEach((route) => {
	app.route("/v1/", route);
});

export type AppType = (typeof routes)[number];

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
