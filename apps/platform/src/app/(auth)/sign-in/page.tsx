import type { Metadata } from "next/types";
import { SignInPage } from "./sign-in";

export const metadata: Metadata = {
	title: "Sign In",
	description: "Sign in to your account",
};

export default function Page() {
	return <SignInPage />;
}
