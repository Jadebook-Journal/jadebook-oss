"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { forgotPasswordAction } from "@/actions/auth";
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
});

export function ForgotPasswordPage() {
	const forgotPasswordMutation = useMutation({
		mutationFn: async ({ email }: { email: string }) => {
			const res = await forgotPasswordAction(email);

			if (!res.success) {
				throw new Error(res.reason);
			}
		},
		onSuccess: () => {
			toast("Password reset link sent to your email");
		},
		onError: (error) => {
			form.setError("root", {
				message: `Failed to reset password: ${error.message}`,
			});
		},
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
		disabled: forgotPasswordMutation.isPending,
	});

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit((values) =>
					forgotPasswordMutation.mutate(values),
				)}
				className="p-6 md:p-8"
			>
				<div className="flex flex-col gap-6">
					<AuthHeader
						title="Forgot Password"
						description="You'll receive a link to reset your password."
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
										disabled={forgotPasswordMutation.isPending}
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
						disabled={forgotPasswordMutation.isPending}
						className="w-full bg-black/90 hover:bg-black/80 text-gray-200"
					>
						<PasswordIcon size={16} weight="bold" />
						Reset password
					</Button>

					<div className="text-center text-sm text-gray-600">
						Remember your password?{" "}
						<Link
							href="/sign-in"
							className="underline underline-offset-4 hover:text-gray-800"
						>
							Log in
						</Link>
					</div>
				</div>
			</form>
		</Form>
	);
}
