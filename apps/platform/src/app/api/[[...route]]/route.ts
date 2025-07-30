import configureOpenAPI from "@backend/configure-open-api";
import createApp from "@backend/create-app";
import { authMiddleware } from "@backend/middlewares/auth";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";

// routes
import asset from "@backend/routes/asset/asset.index";
import entry from "@backend/routes/entry/entry.index";
import exports from "@backend/routes/export/export.index";
import goal from "@backend/routes/goal/goal.index";
import index from "@backend/routes/index.route";
import logs from "@backend/routes/logs/logs.index";
import misc from "@backend/routes/misc/misc.index";
import profile from "@backend/routes/profile/profile.index";
import prompts from "@backend/routes/prompts/prompts.index";
import search from "@backend/routes/search/search.index";
import tag from "@backend/routes/tag/tag.index";
import imports from "@backend/routes/import/import.index";
import { defaultUrl } from "@/lib/utils";

export const runtime = "edge";

const app = createApp();

configureOpenAPI(app);

// Apply an auth check for all main routes
app.use("/*", authMiddleware);

app.use(
	"/*",
	cors({
		origin: [defaultUrl, "http://localhost:3000"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
		maxAge: 3600,
	}),
);

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
	search,
	exports,
	imports,
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
