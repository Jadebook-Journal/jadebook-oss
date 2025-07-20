"use client";

import { motion } from "motion/react";
import { AuthHeader } from "@/components/auth/page";

export function SignUpPage() {
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
				</div>
			</div>
		</motion.div>
	);
}
