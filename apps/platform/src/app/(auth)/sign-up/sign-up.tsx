"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignInIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { signUpAction } from "@/actions/auth";
import { AuthHeader } from "@/components/auth/page";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	email: z.string().email(),
	// minimum length: 8 and needs at least one 1 lowercase, 1 uppercase and 1 digit
	password: z
		.string()
		.min(8)
		.max(50)
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
});

export function SignUpPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signUpMutation = useMutation({
		mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) => {
			const res = await signUpAction({ email, password });

			if (!res.success) {
				throw new Error(res.reason);
			}
		},
		onSuccess: () => {
			toast("Successfully signed up. Check your email for a confirmation");
		},
		onError: (error) => {
			form.setError("root", {
				message: `Failed to sign up: ${error.message}`,
			});
		},
	});

	return (
		<motion.div
			key="sign-up"
			initial={{ opacity: 0.2 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0.2 }}
			transition={{ duration: 0.4 }}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) =>
						signUpMutation.mutate(values),
					)}
					className="p-6 md:p-8"
				>
					<div className="flex flex-col gap-6">
						<AuthHeader
							title="Get started"
							description="Sign up for a Jadebook account"
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-600">Email</FormLabel>
									<FormControl>
										<Input
											placeholder="john.doe@example.com"
											className="border-gray-200"
											{...field}
											disabled={signUpMutation.isPending}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-gray-600">Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											className="border-gray-200"
											{...field}
											disabled={signUpMutation.isPending}
										/>
									</FormControl>
									<FormDescription>
										Needs at least 8 characters and have at least 1 lowercase, 1
										uppercase and 1 numerical digit.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

						{form.formState.errors.root?.message && (
							<p className="text-[0.8rem] font-medium text-destructive">
								{form.formState.errors.root.message}
							</p>
						)}

						<Button
							type="submit"
							disabled={signUpMutation.isPending}
							className="w-full bg-black/90 hover:bg-black/80 text-gray-200"
						>
							<SignInIcon size={16} weight="bold" />
							Sign up
						</Button>

						<div className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<Link
								href="/sign-in"
								className="underline underline-offset-4 hover:text-gray-800"
							>
								Sign in
							</Link>
						</div>
					</div>
				</form>
			</Form>
		</motion.div>
	);
}
