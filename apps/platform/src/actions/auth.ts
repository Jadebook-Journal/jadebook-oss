"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/types/actions";

const authActionParams = z.object({
	email: z.email(),
	password: z.string(),
});

export const signUpAction = async (
	props: z.infer<typeof authActionParams>,
): Promise<ActionResult> => {
	const supabase = await createClient();

	const typedParams = authActionParams.safeParse(props);

	if (!typedParams.success) {
		console.log(typedParams.error);

		return { success: false, reason: typedParams.error.message };
	}

	const { error } = await supabase.auth.signUp(typedParams.data);

	if (error) {
		console.log(error);

		return { success: false, reason: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
};

export const signInAction = async (
	props: z.infer<typeof authActionParams>,
): Promise<ActionResult> => {
	const supabase = await createClient();

	const typedParams = authActionParams.safeParse(props);

	if (!typedParams.success) {
		console.log(typedParams.error);

		return { success: false, reason: typedParams.error.message };
	}

	const { error } = await supabase.auth.signInWithPassword(typedParams.data);

	if (error) {
		console.log(error);

		return { success: false, reason: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
};

export const forgotPasswordAction = async (
	email: z.infer<typeof authActionParams>["email"],
): Promise<ActionResult> => {
	const supabase = await createClient();

	const typedParams = authActionParams
		.omit({ password: true })
		.safeParse({ email });

	if (!typedParams.success) {
		console.log(typedParams.error);

		return { success: false, reason: typedParams.error.message };
	}

	const { error } = await supabase.auth.resetPasswordForEmail(
		typedParams.data.email,
		{ redirectTo: "/" },
	);

	if (error) {
		console.log(error);

		return { success: false, reason: error.message };
	}

	return { success: true };
};

export const resendVerificationEmail = async (
	email: z.infer<typeof authActionParams>["email"],
): Promise<ActionResult> => {
	const supabase = await createClient();

	const typedParams = authActionParams
		.omit({ password: true })
		.safeParse({ email });

	if (!typedParams.success) {
		console.log(typedParams.error);

		return { success: false, reason: typedParams.error.message };
	}

	const { error } = await supabase.auth.resend({
		type: "signup",
		email: typedParams.data.email,
	});

	if (error) {
		console.log(error);

		return { success: false, reason: error.message };
	}

	return { success: true };
};

export const signOutAction = async (): Promise<ActionResult> => {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut();

	if (error) {
		console.log(error);

		return { success: false, reason: error.message };
	}

	// this should make the app recheck for a user, which no longer exists and
	// it'll redirect even if the action's redirect fails
	revalidatePath("/", "layout");

	return { success: true };
};

export const updateUserEmailAction = async (
	email: z.infer<typeof authActionParams>["email"],
): Promise<ActionResult> => {
	const supabase = await createClient();

	const typedParams = authActionParams
		.omit({ password: true })
		.safeParse({ email });

	if (!typedParams.success) {
		console.log(typedParams.error);

		return { success: false, reason: typedParams.error.message };
	}

	const { error } = await supabase.auth.updateUser({
		email: typedParams.data.email,
	});

	if (error) {
		console.log(error);

		return { success: false, reason: error.message };
	}

	return { success: true };
};

export const updateUserPasswordAction = async (
	password: z.infer<typeof authActionParams>["password"],
): Promise<ActionResult> => {
	const supabase = await createClient();

	const typedParams = authActionParams
		.omit({ email: true })
		.safeParse({ password });

	if (!typedParams.success) {
		console.log(typedParams.error);

		return { success: false, reason: typedParams.error.message };
	}

	try {
		// by default, the user must have been recently signed in to change their password
		const { error } = await supabase.auth.updateUser({
			password: typedParams.data.password,
		});

		if (error) {
			console.log(error);

			return { success: false, reason: error.message };
		}

		return { success: true };
	} catch {
		console.log("failed to update password");

		return { success: false, reason: "Failed to update password" };
	}
};
