import { z } from "@hono/zod-openapi";

export const assetEntityType = z.enum(["entry", "goal", "log"]);

// Query parameters for getting assets
export const getAssetsQuery = z.object({
	entityType: assetEntityType.optional().openapi({
		example: "entry",
		description: "Filter assets by entity type",
	}),
	entityId: z.string().optional().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "Filter assets by entity ID",
	}),
});

// Path parameters for asset operations
export const assetParams = z.object({
	id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "The asset ID",
	}),
});

// Asset response schema
export const assetResponse = z.object({
	id: z.string(),
	created_at: z.string(),
	mime_type: z.string(),
	size: z.number(),
	file_name: z.string(),
	path: z.string(),
	entity_type: z.string(),
	entity_id: z.string(),
	user_id: z.string(),
	signed_url: z.string().openapi({
		example:
			"https://example.supabase.co/storage/v1/object/sign/documents/user123/doc456/image.jpg?token=...",
		description: "Pre-signed URL for accessing the file (expires in 1 hour)",
	}),
});

// Asset list response
export const assetsResponse = z.object({
	data: z.array(assetResponse),
});

// Create asset body
export const createAssetBody = z.object({
	mime_type: z.string().openapi({
		example: "image/jpeg",
		description: "MIME type of the file",
	}),
	size: z.number().openapi({
		example: 1024000,
		description: "File size in bytes",
	}),
	filename: z.string().openapi({
		example: "image.jpg",
		description: "Original filename",
	}),
	filepath: z.string().openapi({
		example: "user123/doc456/image.jpg",
		description: "Storage path of the file",
	}),
	entity_type: assetEntityType.openapi({
		example: "entry",
		description: "Type of entity this asset belongs to",
	}),
	entity_id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "ID of the entity this asset belongs to",
	}),
});

// Update asset body (partial updates allowed)
export const updateAssetBody = z
	.object({
		mime_type: z.string().optional(),
		size: z.number().optional(),
		filename: z.string().optional(),
		filepath: z.string().optional(),
		entity_type: assetEntityType.optional(),
		entity_id: z.string().optional(),
	})
	.openapi({
		example: {
			type: "image/png",
			filename: "updated-image.png",
		},
	});

// Delete asset body
export const deleteAssetBody = z.object({
	path: z.string().openapi({
		example: "user123/doc456/image.jpg",
		description: "Storage path of the file to delete",
	}),
});

// Generate signed URL body
export const generateSignedUrlBody = z.object({
	path: z.string().min(1).openapi({
		example: "user123/doc456/image.jpg",
		description: "Storage path of the file",
	}),
	bucket: z.string().optional().default("user-assets").openapi({
		example: "user-assets",
		description: "Storage bucket name",
	}),
});

// Upload file parameters (for multipart form data)
export const uploadFileBody = z.object({
	entity_type: assetEntityType.openapi({
		example: "entry",
		description: "Type of entity this file belongs to",
	}),
	entity_id: z.string().openapi({
		example: "550e8400-e29b-41d4-a716-446655440000",
		description: "ID of the entity this file belongs to",
	}),
});

// Response schemas
export const createAssetResponse = z.object({
	id: z.string(),
});

export const successResponse = z.object({
	message: z.string(),
});

export const signedUrlResponse = z.object({
	signedUrl: z.string(),
});

export const uploadResponse = z.object({
	path: z.string(),
	id: z.string(),
	mime_type: z.string(),
	size: z.number(),
	file_name: z.string(),
	entity_type: assetEntityType,
	entity_id: z.string(),
	signed_url: z.string().openapi({
		example:
			"https://example.supabase.co/storage/v1/object/sign/documents/user123/doc456/image.jpg?token=...",
		description:
			"Pre-signed URL for accessing the uploaded file (expires in 1 hour)",
	}),
});
