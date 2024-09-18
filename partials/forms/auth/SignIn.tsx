"use client";

import React, { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
	Anchor,
	Box,
	Button,
	Center,
	Checkbox,
	Divider,
	Grid,
	GridCol,
	Group,
	PasswordInput,
	Stack,
	Text,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

import AuthProviders from "@/partials/auth/Providers";

import email from "@/libraries/validators/special/email";

import { signIn as authSignIn } from "next-auth/react";

import { typeSignIn } from "@/types/form";

export default function SignIn() {
	const [submitted, setSubmitted] = useState(false);
	const router = useRouter();

	const form = useForm({
		initialValues: {
			email: "",
			password: "",
			remember: false,
		},

		validate: {
			email: value => email(value.trim()),
			password: value => (value.trim().length > 0 ? null : "Please fill out this field"),
		},
	});

	const parse = (rawData: typeSignIn) => {
		return {
			email: rawData.email.trim().toLowerCase(),
			password: rawData.password.trim(),
			rememberMe: rawData.remember,
		};
	};

	const handleSubmit = async (formValues: typeSignIn) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				// // test request body
				// console.log(parse(formValues));

				const res = await authSignIn("credentials", {
					...parse(formValues),
					redirect: false,
					callbackUrl: getCallbackUrlFromQuery(),
				});

				if (!res?.ok) {
					notifications.show({
						id: "sign-in-failed-bad-response",
						icon: <IconX size={16} stroke={1.5} />,
						title: "Bad Response",
						message: "There was a problem with the request",
						variant: "failed",
					});
				} else {
					if (!res.error) {
						// apply callbackurl
						res.url && window.location.replace(res.url);
					} else {
						notifications.show({
							id: `sign-in-failed-${res.error}`,
							icon: <IconX size={16} stroke={1.5} />,
							title: "Authentication Error",
							message: "Incorrect username/password",
							variant: "failed",
						});
					}
				}
			} catch (error) {
				notifications.show({
					id: "sign-in-failed-unexpected",
					icon: <IconX size={16} stroke={1.5} />,
					title: "Unexpected Error",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				form.reset();
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Stack gap={40}>
				<Grid>
					<GridCol span={{ base: 12, sm: 12 }}>
						<TextInput required label={"Email"} placeholder="Your Email" {...form.getInputProps("email")} />
					</GridCol>
					<GridCol span={{ base: 12, xs: 12 }}>
						<Stack gap={"xs"}>
							<PasswordInput
								required
								label={"Password"}
								placeholder="Your password"
								{...form.getInputProps("password")}
								w={"100%"}
							/>

							<Group justify="space-between">
								<Checkbox
									label="Remember me"
									key={form.key("remember")}
									{...form.getInputProps("remember", { type: "checkbox" })}
								/>

								<Anchor
									underline="hover"
									inherit
									fz={"xs"}
									ta={"end"}
									w={"fit-content"}
									component={Link}
									href={"/auth/password/forgot"}
								>
									Forgot password
								</Anchor>
							</Group>
						</Stack>
					</GridCol>
					<GridCol span={12} mt={"md"}>
						<Center>
							<Button w={{ base: "100%", xs: "50%", md: "100%" }} type="submit" loading={submitted}>
								{submitted ? "Signing In" : "Sign In"}
							</Button>
						</Center>
					</GridCol>
				</Grid>

				<Divider label="or continue with" />

				<AuthProviders />

				<Text fz={{ base: "xs", lg: "sm" }} ta={"center"}>
					Don&apos;t have an account?{" "}
					<Anchor inherit fw={500} component={Link} href={"/auth/sign-up"} underline="hover">
						Sign Up
					</Anchor>
				</Text>
			</Stack>
		</Box>
	);
}

function getCallbackUrlFromQuery() {
	const inClient = typeof window !== "undefined";

	if (inClient) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get("callbackUrl") || "/";
	}

	return "/";
}
