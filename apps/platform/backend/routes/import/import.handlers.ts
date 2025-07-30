import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import type { AppRouteHandler } from "../../types";
import type { ImportJSONRoute } from "./import.routes";
import { selectExportResponse } from "../export/export.validation";
import type { z } from "zod";

export const importJSON: AppRouteHandler<ImportJSONRoute> = async (c) => {
	const userId = c.get("userId");
	const supabase = c.get("supabase");

	try {
		const body = await c.req.parseBody();

		const file = body.file as File | undefined;
		const url = body.url as string | undefined;

		if (!file && !url) {
			return c.json(
				{
					message: "No file or url provided",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		let validatedJson: z.infer<typeof selectExportResponse> | null = null;

		if (file) {
			if (file.type !== "application/json") {
				return c.json(
					{
						message: "File is not a JSON file",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}

			const text = await file.text();

			const parsedJson = selectExportResponse.safeParse(JSON.parse(text));

			if (!parsedJson.success) {
				return c.json(
					{
						message: "Invalid JSON",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}

			validatedJson = parsedJson.data;
		} else if (url) {
			const response = await fetch(url);

			if (!response.ok) {
				return c.json(
					{
						message: "Failed to fetch URL",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}

			const rawJson = await response.json();

			const parsedJson = selectExportResponse.safeParse(rawJson);

			if (!parsedJson.success) {
				return c.json(
					{
						message: "Invalid JSON",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}

			validatedJson = parsedJson.data;
		}

		if (!validatedJson) {
			return c.json(
				{
					message: "Invalid JSON",
				},
				HttpStatusCodes.BAD_REQUEST,
			);
		}

		if (validatedJson.type === "entries") {
			const entries = validatedJson.entries;

			if (!entries) {
				return c.json(
					{
						message: "No entries found",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}

			const { error } = await supabase.from("entry").insert(
				entries.map((entry) => {
					const { id: _id, ...rest } = entry;

					return {
						...rest,
						user_id: userId,
					};
				}),
			);

			if (error) {
				console.error(error);

				return c.json(
					{
						message: "Error importing entries",
					},
					HttpStatusCodes.INTERNAL_SERVER_ERROR,
				);
			}

			return c.json(
				{
					message: "Entries imported",
				},
				HttpStatusCodes.OK,
			);
		} else if (validatedJson.type === "goals") {
			const goals = validatedJson.goals;

			if (!goals) {
				return c.json(
					{
						message: "No goals found",
					},
					HttpStatusCodes.BAD_REQUEST,
				);
			}

			// map over the goals, create the goal and then add all the logs for that goal
			for (const goal of goals) {
				const { logs, id: _id, ...goalData } = goal;

				// create the goal
				const { data, error } = await supabase
					.from("goal")
					.insert({
						...goalData,
						user_id: userId,
						end_date: goalData.end_date,
					})
					.select("id")
					.single();

				if (error) {
					console.error(error);

					return c.json(
						{
							message: "Error importing goals",
						},
						HttpStatusCodes.INTERNAL_SERVER_ERROR,
					);
				}

				// add the logs for the goal
				const { error: logsError } = await supabase.from("log").insert(
					logs.map((log) => ({
						...log,
						goal_id: data.id,
					})),
				);

				if (logsError) {
					console.error(logsError);

					return c.json(
						{
							message: "Error importing logs",
						},
						HttpStatusCodes.INTERNAL_SERVER_ERROR,
					);
				}
			}

			return c.json(
				{
					message: "Goals imported",
				},
				HttpStatusCodes.OK,
			);
		}

		return c.json(
			{
				message: "Nothing to import",
			},
			HttpStatusCodes.BAD_REQUEST,
		);
	} catch (error) {
		console.error(error);

		return c.json(
			{
				message: HttpStatusPhrases.INTERNAL_SERVER_ERROR,
			},
			HttpStatusCodes.INTERNAL_SERVER_ERROR,
		);
	}
};
