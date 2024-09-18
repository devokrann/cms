"use client";

import React, { useState } from "react";

import { useRouter } from "next/navigation";

import { Box, Button, Center, Grid, GridCol, Stack, Text, TextInput, Transition } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconX } from "@tabler/icons-react";

import email from "@/libraries/validators/special/email";
import { millToMinSec } from "@/handlers/parsers/number";

interface typeForgot {
	email: string;
}

export default function Forgot() {
	const router = useRouter();

	const [sending, setSending] = useState(false);
	const [requested, setRequested] = useState(false);

	const [time, setTime] = useState<
		| {
				minutes: string;
				seconds: string;
		  }
		| undefined
	>(undefined);

	const form = useForm({
		initialValues: { email: "" },
		validate: { email: value => email(value) },
	});

	const parse = (rawData: typeForgot) => {
		return { email: rawData.email };
	};

	const handleSubmit = async (formValues: typeForgot) => {
		try {
			if (form.isValid()) {
				setSending(true);
				setRequested(true);

				// // test request body
				// console.log(parse(formValues));

				const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/password/forgot`, {
					method: "POST",
					body: JSON.stringify(parse(formValues)),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const res = await response.json();

				if (!res) {
					notifications.show({
						id: "password-forgot-failed-no-response",
						icon: <IconX size={16} stroke={1.5} />,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: "password-forgot-failed-not-found",
							icon: <IconX size={16} stroke={1.5} />,
							title: `Not Found`,
							message: `No account with the provided email exists.`,
							variant: "failed",
						});

						form.reset();

						// redirect to sign up page
						router.replace("/auth/sign-up");
					} else {
						if (!res.user.otl.exists) {
							form.reset();

							// redirect to notification page
							router.replace("/api/auth/verify-request");
						} else {
							if (!res.user.otl.expired) {
								if (!res.user.otl.valid) {
									// reset time
									setTime(millToMinSec(res.user.otl.expiry));
								} else {
									setTime(undefined);
									form.reset();

									// redirect to notification page
									router.replace("/api/auth/verify-request");
								}
							} else {
								setTime(undefined);
								form.reset();

								// redirect to notification page
								router.replace("/api/auth/verify-request");
							}
						}
					}
				}
			}
		} catch (error) {
			notifications.show({
				id: "password-forgot-failed",
				icon: <IconX size={16} stroke={1.5} />,
				title: `Send Failed`,
				message: (error as Error).message,
				variant: "failed",
			});

			form.reset();
		} finally {
			setSending(false);
			setRequested(false);
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack gap={"xl"}>
				<Grid>
					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput required label={"Email"} placeholder="Your Email" {...form.getInputProps("email")} />
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
								{sending ? "Sending" : "Send"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<Transition mounted={time != undefined} transition="fade" duration={0}>
					{styles => (
						<Box style={{ ...styles, transition: "0.25s all ease" }} opacity={requested ? "0" : "1"}>
							<Stack ta={"center"} fz={{ base: "xs", xs: "sm" }}>
								<Text c={"dimmed"} inherit>
									To prevent our system from abuse, we limit the number of times a user can request a
									password reset link.
								</Text>
								<Text c={"dimmed"} inherit>
									You can request a new link in{" "}
									<Text component="span" inherit c={"pri"} fw={500}>
										{time?.minutes} minutes
									</Text>
									.
								</Text>
							</Stack>
						</Box>
					)}
				</Transition>
			</Stack>
		</Box>
	);
}
