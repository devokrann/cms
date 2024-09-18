"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Grid, GridCol, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import password from "@/libraries/validators/special/password";
import compare from "@/libraries/validators/special/compare";

import { signOut as authSignOut, signIn as authSignIn, useSession } from "next-auth/react";

import { typeParams } from "@/app/(authentication)/auth/(default)/layout";

interface typeReset {
	password: string;
}

export default function Reset({ data }: { data: typeParams }) {
	const [sending, setSending] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			password: "",
			passwordConfirm: "",
		},

		validate: {
			password: (value, values) => password(value, 8, 24),
			passwordConfirm: (value, values) => compare.string(value, values.password, "Password"),
		},
	});

	const parse = (rawData: typeReset) => {
		return { password: rawData.password };
	};

	const handleSubmit = async (formValues: typeReset) => {
		try {
			if (form.isValid()) {
				setSending(true);

				// // test request body
				// console.log({ id: data.userId, token: data.token, ...parse(formValues) });

				const response = await fetch(
					process.env.NEXT_PUBLIC_API_URL + `/api/auth/password/reset/${data.userId}/${data.token}`,
					{
						method: "POST",
						body: JSON.stringify(parse(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					}
				);

				const res = await response.json();

				if (!res) {
					notifications.show({
						id: "password-reset-failed-no-response",
						icon: <IconX size={16} stroke={1.5} />,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: "password-reset-failed-not-found",
							icon: <IconX size={16} stroke={1.5} />,
							title: `Not Found`,
							message: `You are not allowed to perform this function.`,
							variant: "failed",
						});

						form.reset();

						// redirect to sign up page
						router.replace("/auth/sign-up");
					} else {
						if (!res.token.valid) {
							notifications.show({
								id: "password-reset-failed-invalid",
								icon: <IconX size={16} stroke={1.5} />,
								title: `Invalid Link`,
								message: `The link is broken, expired or already used.`,
								variant: "failed",
							});

							form.reset();

							// redirect to forgot password page
							router.replace("/auth/password/forgot");
						} else {
							if (!res.user.password.matches) {
								notifications.show({
									id: "password-reset-success",
									withCloseButton: false,
									icon: <IconCheck size={16} stroke={1.5} />,
									title: "Password Changed",
									message: `You have successfully changed your password.`,
									variant: "success",
								});

								form.reset();

								// sign out and redirect to sign in page
								await authSignOut({ redirect: false, callbackUrl: "/" }).then(
									async () => await authSignIn()
								);
							} else {
								notifications.show({
									id: "password-reset-failed-unauthorized",
									icon: <IconX size={16} stroke={1.5} />,
									title: `Parity Not Allowed`,
									message: `New and previous password can't be the same.`,
									variant: "failed",
								});

								form.reset();
							}
						}
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "password-reset-failed",
				icon: <IconX size={16} stroke={1.5} />,
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
				<GridCol span={{ base: 12 }}>
					<Center>
						<Button
							w={{ base: "100%", xs: "50%", md: "100%" }}
							type="submit"
							color="pri"
							loading={sending}
							mt={"md"}
						>
							{sending ? "Updating" : "Update"}
						</Button>
					</Center>
				</GridCol>
			</Grid>
		</Box>
	);
}
