import type { Metadata } from "next/types";
import { SignUpSuccessPage } from "./sign-up-success";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
	title: "Sign Up Success",
	description: "Sign up for a new account successfully.",
};

export default async function Page() {
	const supabase = await createClient();

	const {
		data: { session },
	} = await supabase.auth.getSession();

	let isConfirmed = false;

	if (session?.user?.email_confirmed_at) {
		isConfirmed = true;
	}

	return <SignUpSuccessPage isConfirmed={isConfirmed} />;
}
