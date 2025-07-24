import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

import {
	createDocumentBody,
	createDocumentResponse,
	deleteDocumentParams,
	documentMetadataResponse,
	documentResponse,
	documentsResponse,
	getDocumentParams,
	getDocumentsQuery,
	successResponse,
	updateDocumentBody,
	updateDocumentParams,
} from "./document.validation";

const tags = ["Documents"];

const internalServerErrorSchema = createMessageObjectSchema(
	HttpStatusPhrases.INTERNAL_SERVER_ERROR,
);

export const getDocuments = createRoute({
	path: "/api/documents",
	summary: "Get documents",
	description:
		"Gets a list of documents with pagination. Can be filtered by type, date, and tag id.",
	method: "get",
	request: {
		query: getDocumentsQuery,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			documentsResponse,
			"List of user documents with pagination",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid query parameters",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const getDocument = createRoute({
	path: "/api/documents/{id}",
	summary: "Get document",
	description:
		"Gets a single document by ID — Search Vector will not be returned. Will also return deleted documents.",
	method: "get",
	request: {
		params: getDocumentParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			documentResponse,
			"The requested document",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid document ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Document not found"),
			"Document does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const getDocumentMetadata = createRoute({
	path: "/api/documents/{id}/metadata",
	summary: "Get document metadata",
	description: "Gets only the title and excerpt of a document by ID",
	method: "get",
	request: {
		params: getDocumentParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			documentMetadataResponse,
			"The requested document metadata",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid document ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Document not found"),
			"Document does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const createDocument = createRoute({
	path: "/api/documents",
	summary: "Create document",
	description: "Creates a new document",
	method: "post",
	request: {
		body: jsonContent(createDocumentBody, "Document creation data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.CREATED]: jsonContent(
			createDocumentResponse,
			"Document created successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const updateDocument = createRoute({
	path: "/api/documents/{id}",
	summary: "Update document",
	description:
		"Updates a document — internally handles embeddings and text extraction from the editor content. Notes are not supported since they will be deprecated.",
	method: "put",
	request: {
		params: updateDocumentParams,
		body: jsonContent(updateDocumentBody, "Document update data"),
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Document updated successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid request data",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Document not found"),
			"Document does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export const deleteDocument = createRoute({
	path: "/api/documents/{id}",
	summary: "Delete document",
	description: "Deletes a document",
	method: "delete",
	request: {
		params: deleteDocumentParams,
	},
	tags,
	responses: {
		[HttpStatusCodes.OK]: jsonContent(
			successResponse,
			"Document deleted successfully",
		),
		[HttpStatusCodes.BAD_REQUEST]: jsonContent(
			createMessageObjectSchema("Bad request"),
			"Invalid document ID",
		),
		[HttpStatusCodes.UNAUTHORIZED]: jsonContent(
			createMessageObjectSchema("Unauthorized"),
			"Authentication required",
		),
		[HttpStatusCodes.NOT_FOUND]: jsonContent(
			createMessageObjectSchema("Document not found"),
			"Document does not exist or access denied",
		),
		[HttpStatusCodes.TOO_MANY_REQUESTS]: jsonContent(
			createMessageObjectSchema("Too many requests"),
			"Rate limit exceeded",
		),
		[HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
			internalServerErrorSchema,
			"Internal server error",
		),
	},
});

export type GetDocumentsRoute = typeof getDocuments;
export type GetDocumentRoute = typeof getDocument;
export type GetDocumentMetadataRoute = typeof getDocumentMetadata;
export type CreateDocumentRoute = typeof createDocument;
export type UpdateDocumentRoute = typeof updateDocument;
export type DeleteDocumentRoute = typeof deleteDocument;
