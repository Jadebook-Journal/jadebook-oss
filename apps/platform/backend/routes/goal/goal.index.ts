import { createRouter } from "@backend/create-app";

import * as handlers from "./goal.handlers";
import * as routes from "./goal.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getGoals, handlers.getGoals);
router.openapi(routes.getGoal, handlers.getGoal);
router.openapi(routes.createGoal, handlers.createGoal);
router.openapi(routes.updateGoal, handlers.updateGoal);
router.openapi(routes.deleteGoal, handlers.deleteGoal);

export default router;
