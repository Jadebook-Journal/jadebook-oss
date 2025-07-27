import { createRouter } from "@backend/create-app";

import * as handlers from "./search.handlers";
import * as routes from "./search.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getSearchJadebook, handlers.getSearchJadebook);

export default router;
