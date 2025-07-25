import configureOpenAPI from "@backend/configure-open-api";
import createApp from "@backend/create-app";
import { authMiddleware } from "@backend/middlewares/auth";
import { handle } from "hono/vercel";

// routes
import index from "@backend/routes/index.route";
import asset from "@backend/routes/asset/asset.index";
import profile from "@backend/routes/profile/profile.index";
import entry from "@backend/routes/entry/entry.index";
import goal from "@backend/routes/goal/goal.index";
import logs from "@backend/routes/logs/logs.index";
import tag from "@backend/routes/tag/tag.index";
import misc from "@backend/routes/misc/misc.index";
import prompts from "@backend/routes/prompts/prompts.index";

export const runtime = "edge";

const app = createApp();

configureOpenAPI(app);

// Apply an auth check for all main routes
app.use("/*", authMiddleware);

// add all the other routes
const routes = [
	index,
	profile,
	asset,
	entry,
	goal,
	logs,
	tag,
	misc,
	prompts,
] as const;

routes.forEach((route) => {
	app.route("/", route);
});

export type AppType = (typeof routes)[number];

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
