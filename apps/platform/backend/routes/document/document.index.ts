import { createRouter } from "@backend/create-app";

import * as handlers from "./document.handlers";
import * as routes from "./document.routes";

const router = createRouter();

// Register routes
router.openapi(routes.getDocuments, handlers.getDocuments);
router.openapi(routes.getDocument, handlers.getDocument);
router.openapi(routes.getDocumentMetadata, handlers.getDocumentMetadata);
router.openapi(routes.createDocument, handlers.createDocument);
router.openapi(routes.updateDocument, handlers.updateDocument);
router.openapi(routes.deleteDocument, handlers.deleteDocument);

export default router;
