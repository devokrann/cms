"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Anchor, Box, Button, Grid, GridCol, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import password from "@/libraries/validators/special/password";
import compare from "@/libraries/validators/special/compare";

import { signOut } from "next-auth/react";

export default function Password() {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			passwordCurrent: "",
			password: "",
			passwordConfirm: "",
		},

		validate: {
			passwordCurrent: value => password(value, 8, 24),
			password: (value, values) =>
				value == values.passwordCurrent
					? "Current and new passwords cannot be the same"
					: password(value, 8, 24),
			passwordConfirm: (value, values) => compare.string(value, values.password, "Password"),
		},
	});

	const parse = (rawData: any) => {
		return {
			passwordCurrent: rawData.passwordCurrent,
			passwordNew: rawData.password,
		};
	};

	const handleSubmit = async (formValues: any) => {
		try {
			if (form.isValid()) {
				setSending(true);

				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/settings/password`, {
					method: "POST",
					body: JSON.stringify({
						passwordCurrent: parse(formValues).passwordCurrent,
						passwordNew: parse(formValues).passwordNew,
					}),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const res = await response.json();

				if (!res) {
					notifications.show({
						id: "password-reset-failed-no-response",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: "password-reset-failed-not-found",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: `Not Found`,
							message: `The account is not valid.`,
							variant: "failed",
						});

						// sign out and redirect to sign in page
						await signOut({ redirect: false, callbackUrl: "/" }).then(() =>
							router.replace("/auth/sign-up")
						);
					} else {
						if (!res.user.password.match) {
							notifications.show({
								id: "password-reset-failed-unauthorized",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Unauthorized`,
								message: `You've entered the wrong password.`,
								variant: "failed",
							});
						} else {
							notifications.show({
								id: "password-reset-success",
								withCloseButton: false,
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Password Changed",
								message: `You have successfully cahnged your password.`,
								variant: "success",
							});
						}

						form.reset();
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "password-reset-failed",
				icon: <IconX size={16} stroke={1.5} />,
				autoClose: 5000,
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed",
			});
		} finally {
			setSending(false);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Grid>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"Current Password"}
						placeholder="Your Current Password"
						{...form.getInputProps("passwordCurrent")}
						description={
							<>
								If you can&apos;t remember, you can{" "}
								<Anchor underline="always" inherit component={Link} href="/auth/password/forgot">
									reset your password
								</Anchor>
								.
							</>
						}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"New Password"}
						placeholder="Your New Password"
						{...form.getInputProps("password")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6, md: 12 }}>
					<PasswordInput
						required
						label={"Confirm New Password"}
						placeholder="Confirm Your New Password"
						{...form.getInputProps("passwordConfirm")}
					/>
				</GridCol>
				<GridCol span={{ base: 6 }}>
					<Button type="submit" color="pri" loading={sending} mt={"md"}>
						{sending ? "Updating" : "Update"}
					</Button>
				</GridCol>
			</Grid>
		</Box>
	);
}
