"use client";

import { motion } from "motion/react";
import { AuthHeader } from "@/components/auth/page";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { resendVerificationEmail } from "@/actions/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ErrorRoute } from "@/components/routes/error";

export function SignUpSuccessPage({ isConfirmed }: { isConfirmed: boolean }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const [countdown, setCountdown] = React.useState(30);

	// Redirect if user is already verified
	React.useEffect(() => {
		if (isConfirmed) {
			router.replace("/");
		}
	}, [isConfirmed, router]);

	// Countdown timer
	React.useEffect(() => {
		const timer = setInterval(() => {
			setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const resendEmailMutation = useMutation({
		mutationFn: async ({ email }: { email: string }) => {
			if (countdown !== 0) {
				throw new Error("Please wait for the countdown to finish");
			}

			if (!email) {
				throw new Error("Email not found");
			}

			const res = await resendVerificationEmail(email);

			if (!res.success) {
				throw new Error(res.reason);
			}
		},
		onSuccess: () => {
			toast("Verification email sent");

			setCountdown(30);
		},
		onError: (error) => {
			console.error(error);

			toast("Error occurred");
		},
	});

	if (!email) {
		return <ErrorRoute message="Email not found" />;
	}

	return (
		<motion.div
			key="sign-up"
			initial={{ opacity: 0.2 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0.2 }}
			transition={{ duration: 0.4 }}
		>
			<div className="p-6 md:p-8">
				<div className="flex flex-col gap-6">
					<AuthHeader
						title="Sign Up Confirmation"
						description="You've successfully signed up. Please check your email to confirm your account before signing in."
					/>
					<Button
						disabled={resendEmailMutation.isPending || countdown !== 0}
						onClick={() => resendEmailMutation.mutate({ email: email ?? "" })}
					>
						Resend Email
					</Button>

					<p className="text-sm text-muted-foreground">
						You can resend the email every {countdown} seconds.
					</p>
				</div>
			</div>
		</motion.div>
	);
}
