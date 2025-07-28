"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import {
	signOutAction,
	updateUserEmailAction,
	updateUserPasswordAction,
} from "@/actions/auth";
import { PageSection } from "@/components/app/page";
import { PageContainer } from "@/components/app/page-container";
import { SettingsPanel, SettingsPanelSection } from "@/components/settings";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { useProfileMutations } from "@/mutations/use-profile-mutations";
import { useAppStore } from "@/providers/app-store-provider";

export function AccountPage() {
	return (
		<PageContainer title="Account">
			<SettingsPanel>
				<SettingsPanelSection
					title="Username"
					description="Whatever you'd like us to refer to you as."
				>
					<UsernameSection />
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Email"
					description="Your email address. Used to sign in and receive any emails from us."
				>
					<EmailSection />
				</SettingsPanelSection>

				<SettingsPanelSection
					title="Password"
					description="Your password. Used to sign in to your account."
				>
					<PasswordSection />
				</SettingsPanelSection>
			</SettingsPanel>

			<PageSection title="Actions">
				<SettingsPanel>
					<SettingsPanelSection
						title="Log out"
						description="Log out of your account. You'll need to reenter your credentials to log back in."
					>
						<Button
							variant="outline"
							onClick={async () => {
								const res = await signOutAction();

								if (res.success) {
									// we don't want to use router because we want a full page navigation
									window.open("/sign-in", "_self");
								}
							}}
						>
							Log out
						</Button>
					</SettingsPanelSection>
					<SettingsPanelSection
						title="Delete Account"
						description="Permanently and completely delete your account."
					>
						<DeleteSection />
					</SettingsPanelSection>
				</SettingsPanel>
			</PageSection>
		</PageContainer>
	);
}

function UsernameSection() {
	const { profile } = useAppStore((store) => ({
		profile: store.profile,
	}));

	const [username, setUsername] = React.useState<string>(
		profile.username || "",
	);

	const [openUsernameDialog, setOpenUsernameDialog] = React.useState(false);

	const { updateProfileMutation } = useProfileMutations({
		onSuccess: () => {
			toast.success("Username updated");
			setOpenUsernameDialog(false);
			setUsername(profile.username || "");
		},
	});

	return (
		<Dialog open={openUsernameDialog} onOpenChange={setOpenUsernameDialog}>
			<DialogTrigger asChild>
				<Button variant="outline">Update username</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Username</DialogTitle>
					<DialogDescription>
						Update your username for this account. This will be used to refer to
						you in the app.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Input
						value={username}
						placeholder={
							profile.username || "What would you like to be called?"
						}
						onChange={(e) => setUsername(e.target.value)}
						disabled={updateProfileMutation.isPending}
						maxLength={32}
					/>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={updateProfileMutation.isPending}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						disabled={!username || updateProfileMutation.isPending}
						type="submit"
						variant="default"
						size="sm"
						onClick={() => {
							updateProfileMutation.mutate({
								data: {
									username,
								},
							});
						}}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function EmailSection() {
	const { session } = useAppStore((store) => ({
		session: store.session,
	}));

	const [sessionEmail, setSessionEmail] = React.useState<string>(
		session.user.email || "",
	);

	const [openEmailDialog, setOpenEmailDialog] = React.useState(false);

	const updateEmailMutation = useMutation({
		mutationFn: ({ email }: { email: string }) => {
			return updateUserEmailAction(email);
		},
		onSuccess: () => {
			toast.success("Email updated");

			setOpenEmailDialog(false);

			setSessionEmail(session.user.email || "");
		},
		onError: (error) => {
			toast.error("Failed to update email");

			console.error(error);
		},
	});

	return (
		<Dialog open={openEmailDialog} onOpenChange={setOpenEmailDialog}>
			<DialogTrigger asChild>
				<Button variant="outline">Update email</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Email</DialogTitle>
					<DialogDescription>
						Update your email for this account. This will be used to sign in to
						your account. Note, you will need to verify your new email address
						after updating.
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<Input
						value={sessionEmail}
						placeholder={session.user.email || "Your email address"}
						onChange={(e) => setSessionEmail(e.target.value)}
						disabled={updateEmailMutation.isPending}
						maxLength={32}
					/>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							disabled={updateEmailMutation.isPending}
						>
							Cancel
						</Button>
					</DialogClose>

					<Button
						disabled={!sessionEmail || updateEmailMutation.isPending}
						type="submit"
						variant="default"
						size="sm"
						onClick={() => {
							updateEmailMutation.mutate({
								email: sessionEmail,
							});
						}}
					>
						Confirm
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

const passwordFormSchema = z
	.object({
		one: z
			.string()
			.min(8)
			.max(50)
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
		two: z
			.string()
			.min(8)
			.max(50)
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
	})
	.refine((data) => data.one === data.two, {
		message: "Passwords don't match",
		path: ["two"],
	});

function PasswordSection() {
	const [openPasswordDialog, setOpenPasswordDialog] = React.useState(false);

	const form = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			one: "",
			two: "",
		},
	});

	const updatePasswordMutation = useMutation({
		mutationFn: ({ password }: { password: string }) => {
			return updateUserPasswordAction(password);
		},
		onSuccess: () => {
			toast.success("Password updated");
			setOpenPasswordDialog(false);
			form.reset();
		},
		onError: (error) => {
			toast.error("Failed to update password");
			console.error(error);
		},
	});

	return (
		<Dialog open={openPasswordDialog} onOpenChange={setOpenPasswordDialog}>
			<DialogTrigger asChild>
				<Button variant="outline">Update password</Button>
			</DialogTrigger>
			<DialogContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((values) => {
							updatePasswordMutation.mutate({ password: values.one });
						})}
					>
						<DialogHeader>
							<DialogTitle>Update Password</DialogTitle>
							<DialogDescription>
								Update your password for this account. This will be used to sign
								in to your account. Note, you will need to verify your new
								password after updating.
							</DialogDescription>
						</DialogHeader>

						<div className="space-y-4 py-4">
							<FormField
								control={form.control}
								name="one"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New Password</FormLabel>
										<FormControl>
											<Input
												placeholder="Minimum 8 characters"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											Needs at least 8 characters and have at least 1 lowercase,
											1 uppercase and 1 numerical digit.
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="two"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												placeholder="Minimum 8 characters"
												type="password"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter>
							<DialogClose asChild>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									disabled={updatePasswordMutation.isPending}
								>
									Cancel
								</Button>
							</DialogClose>

							<Button
								disabled={
									!form.formState.isValid || updatePasswordMutation.isPending
								}
								type="submit"
								variant="default"
								size="sm"
							>
								Confirm
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function DeleteSection() {
	const { profile } = useAppStore((store) => ({
		profile: store.profile,
	}));

	const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);

	const { deleteProfileMutation } = useProfileMutations();

	// if not deleted, allow deletion
	return (
		<ConfirmDialog
			destructive
			open={openDeleteDialog}
			onOpenChange={setOpenDeleteDialog}
			title="Delete account"
			description={
				<>
					Since you're using Jadebook OSS, we can't run long running jobs — this
					means that if you have too many assets, you might need to manually
					delete them.
					<br />
					<br />
					We'll wipe all assets and anything else associated with your account,
					including goals, tags, entries and more.
				</>
			}
			onConfirm={() => {
				deleteProfileMutation.mutate();
			}}
		>
			<Button variant="destructive">Delete account</Button>
		</ConfirmDialog>
	);
}
