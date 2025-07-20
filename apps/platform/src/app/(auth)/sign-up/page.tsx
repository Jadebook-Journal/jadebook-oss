import type { Metadata } from "next/types";
import { SignUpPage } from "./sign-up";

export const metadata: Metadata = {
	title: "Sign Up",
	description: "Sign up for a new account",
};

export default function Page() {
	return <SignUpPage />;
}
