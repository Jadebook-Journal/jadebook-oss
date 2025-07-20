"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SignInIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { signInAction } from "@/actions/auth";
import { AuthHeader } from "@/components/auth/page";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
	email: z.email(),
	password: z.string().min(8),
});

export function SignInPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const signInMutation = useMutation({
		mutationFn: async ({
			email,
			password,
		}: {
			email: string;
			password: string;
		}) => {
			const res = await signInAction({ email, password });

			if (!res.success) {
				throw new Error(res.reason);
			}
		},
		onError: (error) => {
			form.setError("root", {
				message: `Failed to sign in: ${error.message}`,
			});
		},
	});

	return (
		<motion.div
			key="sign-in"
			initial={{ opacity: 0.2 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0.2 }}
			transition={{ duration: 0.4 }}
		>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit((values) =>
						signInMutation.mutate(values),
					)}
					className="p-6 md:p-8"
				>
					<div className="flex flex-col gap-6">
						<AuthHeader
							title="Welcome back"
							description="Sign in to your Jadebook account"
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
											disabled={signInMutation.isPending}
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
									<div className="flex items-center justify-between p-1">
										<FormLabel className="text-gray-600">Password</FormLabel>

										<Link
											href="/forgot-password"
											className="text-gray-900 opacity-50 hover:opacity-100 text-xs hover:underline transition-all ease-in-out leading-none"
										>
											Forgot password?
										</Link>
									</div>
									<FormControl>
										<Input
											type="password"
											className="border-gray-200"
											{...field}
											disabled={signInMutation.isPending}
										/>
									</FormControl>
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
							disabled={signInMutation.isPending}
							className="w-full bg-black/90 hover:bg-black/80 text-gray-200"
						>
							<SignInIcon size={16} weight="bold" />
							Log in
						</Button>

						<div className="text-center text-sm text-gray-600">
							Don&apos;t have an account?{" "}
							<Link
								href="/sign-up"
								className="underline underline-offset-4 hover:text-gray-800"
							>
								Sign up
							</Link>
						</div>
					</div>
				</form>
			</Form>
		</motion.div>
	);
}
