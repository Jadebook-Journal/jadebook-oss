import { createRouter } from "@backend/create-app";

import * as handlers from "./misc.handlers";
import * as routes from "./misc.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getPinnedResources, handlers.getPinnedResources);

export default router;
