import { createRouter } from "@backend/create-app";

import * as handlers from "./tag.handlers";
import * as routes from "./tag.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getTags, handlers.getTags);
router.openapi(routes.getTag, handlers.getTag);
router.openapi(routes.createTag, handlers.createTag);
router.openapi(routes.updateTag, handlers.updateTag);
router.openapi(routes.deleteTag, handlers.deleteTag);
router.openapi(routes.getGoalsByTag, handlers.getGoalsByTag);

export default router;
