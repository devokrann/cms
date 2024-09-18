"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Anchor, Box, Button, Divider, Grid, GridCol, PasswordInput, Stack, Switch, Text, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import password from "@/libraries/validators/special/password";
import compare from "@/libraries/validators/special/compare";

import { Session, User } from "next-auth";
import { signOut, useSession } from "next-auth/react";

import classes from "./Notifications.module.scss";

export default function Notifications() {
	const session = useSession();

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
				value.length > 0
					? value == values.passwordCurrent
						? "Current and new passwords cannot be the same"
						: password(value, 8, 24)
					: "Please fill out this field",
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

				const response = await fetch(
					process.env.NEXT_PUBLIC_API_URL + `/api/${session.data?.userId}/settings/account/password`,
					{
						method: "POST",
						body: JSON.stringify({
							passwordCurrent: parse(formValues).passwordCurrent,
							passwordNew: parse(formValues).passwordNew,
						}),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					}
				);

				const result = await response.json();

				if (!result) {
					notifications.show({
						id: "password-reset-failed-no-response",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!result.user.exists) {
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
						if (!result.user.password.match) {
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

	const getLabel = ({ title, desc }: { title: string; desc?: string }) => (
		<Stack gap={0}>
			<Title order={4} fz={"md"}>
				{title}
			</Title>
			{desc && <Text fz={"sm"}>{desc}</Text>}
		</Stack>
	);

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Grid gutter={40}>
				<GridCol span={12}>
					<Grid>
						<GridCol span={{ base: 12 }}>
							<Title order={4} fz={"lg"}>
								Email Notifications
							</Title>
						</GridCol>

						<GridCol span={{ base: 12 }}>
							<Divider />
						</GridCol>

						<GridCol span={{ base: 12 }}>
							<Switch
								classNames={{ body: classes.body, labelWrapper: classes.labelWrapper }}
								labelPosition="left"
								label={getLabel({
									title: "Weekly Notification",
									desc: "Various versions have evolved over the years, sometimes by accident, sometimes on purpose.",
								})}
							/>
						</GridCol>
						<GridCol span={{ base: 12 }}>
							<Switch
								classNames={{ body: classes.body, labelWrapper: classes.labelWrapper }}
								labelPosition="left"
								label={getLabel({
									title: "Account Summary",
									desc: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis eguris eu sollicitudin massa.",
								})}
							/>
						</GridCol>
					</Grid>
				</GridCol>

				<GridCol span={12}>
					<Grid>
						<GridCol span={{ base: 12 }}>
							<Title order={4} fz={"lg"}>
								Order Updates
							</Title>
						</GridCol>

						<GridCol span={{ base: 12 }}>
							<Divider />
						</GridCol>

						<GridCol span={{ base: 12 }}>
							<Switch
								classNames={{ body: classes.body, labelWrapper: classes.labelWrapper }}
								labelPosition="left"
								label={getLabel({
									title: "Text messages",
								})}
							/>
						</GridCol>
						<GridCol span={{ base: 12 }}>
							<Switch
								classNames={{ body: classes.body, labelWrapper: classes.labelWrapper }}
								labelPosition="left"
								label={getLabel({
									title: "Call before checkout",
									desc: "We'll only call if there are pending changes.",
								})}
							/>
						</GridCol>
					</Grid>
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
