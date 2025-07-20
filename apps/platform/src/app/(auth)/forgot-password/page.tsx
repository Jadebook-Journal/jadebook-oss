import type { Metadata } from "next/types";
import { ForgotPasswordPage } from "./forgot-password";

export const metadata: Metadata = {
	title: "Forgot Password",
	description: "Forgot your password? Reset it here.",
};

export default function Page() {
	return <ForgotPasswordPage />;
}
