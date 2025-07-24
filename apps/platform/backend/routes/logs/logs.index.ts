import { createRouter } from "@backend/create-app";

import * as handlers from "./logs.handlers";
import * as routes from "./logs.routes";

const router = createRouter()
	.openapi(routes.getGoalLogs, handlers.getGoalLogs)
	.openapi(routes.createGoalLog, handlers.createGoalLog)
	.openapi(routes.updateGoalLog, handlers.updateGoalLog)
	.openapi(routes.deleteGoalLog, handlers.deleteGoalLog);

export default router;
