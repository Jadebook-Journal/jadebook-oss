import type { selectExportResponse } from "@backend/routes/export/export.validation";
import type { NextRequest } from "next/server";
import type z from "zod";
import { createClient } from "@/lib/supabase/server";

// this is a separate route from the backend since we don't want to run the auth middleware
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ exportId: string }> },
) {
	const { exportId } = await params;

	// get search param for download
	const searchParams = request.nextUrl.searchParams;
	const download = searchParams.get("download");

	// this api route needs to be accessible publicly
	const supabase = await createClient({ admin: true });

	const { data: exportData, error: exportError } = await supabase
		.from("export")
		.select("*")
		.eq("id", exportId)
		.single();

	if (exportError) {
		console.error(exportError);

		return new Response(JSON.stringify({ error: "Export not found" }), {
			status: 404,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	if (exportData.expire_at < new Date().toISOString()) {
		return new Response(JSON.stringify({ error: "Export expired" }), {
			status: 403,
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	// we want the time to be 0am for the start and 11:59:59pm for the end date
	const startDate = new Date(exportData.start_date);
	startDate.setHours(0, 0, 0, 0);
	const endDate = new Date(exportData.end_date);
	endDate.setHours(23, 59, 59, 999);

	let entries: z.infer<typeof selectExportResponse>["entries"] = null;
	let goals: z.infer<typeof selectExportResponse>["goals"] = null;

	if (exportData.type === "entries") {
		// fetch the data
		const { data: entriesData, error: entriesError } = await supabase
			.from("entry")
			.select(
				"id, title, content, created_at, updated_at, entry_date, icon, cover, type",
			)
			.eq("user_id", exportData.user_id)
			.gte("entry_date", startDate.toISOString())
			.lte("entry_date", endDate.toISOString());

		if (entriesError) {
			console.error(entriesError);

			return new Response(
				JSON.stringify({ error: "Failed to fetch entries" }),
				{
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				},
			);
		}

		entries = entriesData.map((entry) => ({
			...entry,
			type: entry.type as "entry" | "prompted",
		}));
	} else if (exportData.type === "goals") {
		const { data: goalsData, error: goalsError } = await supabase
			.from("goal")
			.select("id, title, description, created_at, updated_at, icon, cover")
			.eq("user_id", exportData.user_id)
			.gte("created_at", startDate.toISOString())
			.lte("created_at", endDate.toISOString());

		if (goalsError) {
			console.error(goalsError);

			return new Response(JSON.stringify({ error: "Failed to fetch goals" }), {
				status: 500,
				headers: {
					"Content-Type": "application/json",
				},
			});
		}

		goals = goalsData.map((goal) => ({
			...goal,
			logs: [], // empty array for now
		}));
	}

	if (exportData.type === "goals" && goals && goals.length > 0) {
		for (const goal of goals) {
			const { data: logsData, error: logsError } = await supabase
				.from("log")
				.select("created_at, type, content")
				.eq("goal_id", goal.id)
				.eq("user_id", exportData.user_id)
				.gte("created_at", startDate.toISOString())
				.lte("created_at", endDate.toISOString());

			if (logsError) {
				console.error(logsError);

				return new Response(JSON.stringify({ error: "Failed to fetch logs" }), {
					status: 500,
					headers: {
						"Content-Type": "application/json",
					},
				});
			}

			goal.logs = logsData.map((log) => ({
				...log,
				type: log.type as "neutral" | "good" | "bad",
			}));
		}
	}

	const responseData = {
		generated_at: new Date().toISOString(),
		platform: "jadebook-oss",
		type: exportData.type as "entries" | "goals",
		entries,
		goals,
	};

	if (download === "true") {
		// Check if download parameter is true
		const filename = `${exportData.type}_export_${exportData.start_date}_to_${exportData.end_date}.json`;

		return new Response(JSON.stringify(responseData, null, 2), {
			status: 200,
			headers: {
				"Content-Type": "application/json",
				"Content-Disposition": `attachment; filename="${filename}"`,
			},
		});
	}

	return new Response(JSON.stringify(responseData, null, 2), {
		status: 200,
		headers: {
			"Content-Type": "application/json",
		},
	});
}
