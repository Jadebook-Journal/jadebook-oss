import { createRouter } from "@backend/create-app";
import * as handlers from "./export.handlers";
import * as routes from "./export.routes";

const router = createRouter();

// Define routes
router.openapi(routes.getUserExports, handlers.getUserExports);
router.openapi(routes.createUserExport, handlers.createUserExport);
router.openapi(routes.getUserExport, handlers.getUserExport);

export default router;
