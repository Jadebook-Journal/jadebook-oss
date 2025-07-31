import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

export async function GET() {
	try {
		// Read the icon.png file from the assets folder
		const iconPath = join(process.cwd(), "src", "assets", "icon.png");
		const iconBuffer = readFileSync(iconPath);

		// Return the image with proper headers
		return new NextResponse(iconBuffer, {
			status: 200,
			headers: {
				"Content-Type": "image/png",
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		});
	} catch (error) {
		console.error("Error serving icon:", error);
		return NextResponse.json({ error: "Icon not found" }, { status: 404 });
	}
}
