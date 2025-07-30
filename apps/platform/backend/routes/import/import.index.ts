import { createRouter } from "@backend/create-app";
import * as handlers from "./import.handlers";
import * as routes from "./import.routes";

const router = createRouter();

// Define routes
router.openapi(routes.importJSON, handlers.importJSON);

export default router;
