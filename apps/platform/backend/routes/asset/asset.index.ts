import { createRouter } from "@backend/create-app";

import * as handlers from "./asset.handlers";
import * as routes from "./asset.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getAssets, handlers.getAssets);
router.openapi(routes.getAsset, handlers.getAsset);
router.openapi(routes.createAsset, handlers.createAsset);
router.openapi(routes.updateAsset, handlers.updateAsset);
router.openapi(routes.deleteAsset, handlers.deleteAsset);
router.openapi(routes.generateSignedUrl, handlers.generateSignedUrl);
router.openapi(routes.uploadFile, handlers.uploadFile);

export default router;
