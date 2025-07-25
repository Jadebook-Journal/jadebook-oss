import { createRouter } from "@backend/create-app";

import * as routes from "./prompts.routes";
import * as handlers from "./prompts.handlers";

const router = createRouter();

// Register routes
router.openapi(routes.getPrompts, handlers.getPrompts);

export default router;
