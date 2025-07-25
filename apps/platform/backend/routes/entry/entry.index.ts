import { createRouter } from "@backend/create-app";

import * as handlers from "./entry.handlers";
import * as routes from "./entry.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getEntries, handlers.getEntries);
router.openapi(routes.getEntry, handlers.getEntry);
router.openapi(routes.getEntryMetadata, handlers.getEntryMetadata);
router.openapi(routes.createEntry, handlers.createEntry);
router.openapi(routes.updateEntry, handlers.updateEntry);
router.openapi(routes.deleteEntry, handlers.deleteEntry);

export default router;
