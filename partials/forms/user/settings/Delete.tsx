"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Group, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import { signOut } from "next-auth/react";

interface typeAccountDelete {
	password: string;
}

export default function Delete() {
	const [submitted, setSubmitted] = useState(false);

	const router = useRouter();

	const form = useForm({
		initialValues: {
			password: "",
		},
	});

	const parse = (rawData: typeAccountDelete) => {
		return {
			password: rawData.password,
		};
	};

	const handleSignOut = async () =>
		await signOut({ redirect: false, callbackUrl: "/" }).then(() => router.replace("/"));

	const handleSubmit = async (formValues: typeAccountDelete) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/settings/delete`, {
					method: "POST",
					body: JSON.stringify(parse(formValues)),
					headers: { "Content-Type": "application/json", Accept: "application/json" },
				});

				const res = await response.json();

				if (!res) {
					notifications.show({
						id: "account-deletion-failed-no-response",
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

						form.reset();
						await handleSignOut();
					} else {
						if (!res.user.password.match) {
							notifications.show({
								id: "password-reset-failed-not-found",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: `Authentication Error`,
								message: `Incorrect password provided.`,
								variant: "failed",
							});

							form.reset();
						} else {
							notifications.show({
								id: "account-deletion-success",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Account Deleted",
								message: "Your account has been successfully deleted",
								variant: "success",
							});

							form.reset();
							await handleSignOut();
						}
					}
				}
			} catch (error) {
				notifications.show({
					id: "account-deletion-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack>
				<PasswordInput
					required
					label={"Password"}
					placeholder="Your Password"
					description="Leave empty if you didn't set password (i.e. signed in with OAuth such as Google)"
					{...form.getInputProps("password")}
				/>
				<Group justify="end">
					<Button type="submit" color="red.6" variant="light" loading={submitted}>
						{submitted ? "Deleting" : "Delete Account"}
					</Button>
				</Group>
			</Stack>
		</Box>
	);
}
