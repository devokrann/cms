"use client";

import React, { useState } from "react";

import { Box, Button, Grid, GridCol, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import { useSession } from "next-auth/react";
import text from "@/libraries/validators/special/text";
import email from "@/libraries/validators/special/email";
import { capitalizeWords } from "@/handlers/parsers/string";
import phone from "@/libraries/validators/special/phone";

interface typeProfileDetails {
	name?: string | null;
	email?: string | null;
	phone?: string | null;
}

export default function Details() {
	const { data: session, update } = useSession();

	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			name: session?.user?.name ? session?.user?.name : "",
			email: session?.user?.email,
			phone: "",
		},

		validate: {
			name: value => (value && value?.trim().length > 0 ? text(value, 2, 255) : "Please fill out this field."),
			email: value => value && email(value),
			phone: value => value.trim().length > 0 && phone(value),
		},
	});

	const parse = (rawData: typeProfileDetails) => {
		return {
			name: rawData.name && capitalizeWords(rawData.name),
			email: rawData.email && rawData.email.trim().toLowerCase(),
			phone: rawData.phone?.trim() ? (rawData.phone.trim().length > 0 ? rawData.phone : null) : null,
		};
	};

	const handleSubmit = async (formValues: typeProfileDetails) => {
		if (form.isValid()) {
			try {
				if (!form.isDirty()) {
					notifications.show({
						id: "form-contact-failed-no-update",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Failed",
						message: "No form fields have been updated",
						variant: "failed",
					});
				} else {
					setSubmitted(true);

					const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/account/profile", {
						method: "POST",
						body: JSON.stringify(parse(formValues)),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					});

					const result = await response.json();

					if (!result) {
						notifications.show({
							id: "profile-update-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});

						form.reset();
					} else {
						if (!result.user.exists) {
							notifications.show({
								id: "profile-update-failed-no-user",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Unauthorized",
								message: `You're not allowed to perform this action.`,
								variant: "failed",
							});

							form.reset();
						} else {
							// Update the session data on the client-side
							await update({
								...session,
								user: {
									...session?.user,
									name: parse(formValues).name,
								},
							});

							notifications.show({
								id: "profile-update-success",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Profile Updated",
								message: "Your profile details are up to date.",
								variant: "success",
							});
						}
					}
				}
			} catch (error) {
				notifications.show({
					id: "profile-update-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed",
				});

				form.reset();
			} finally {
				setSubmitted(false);
			}
		}
	};

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit(values))} noValidate>
			<Grid>
				<GridCol span={{ base: 12 }}>
					<TextInput
						required
						label={"Name"}
						placeholder="Your Name"
						{...form.getInputProps("name")}
						disabled={!session}
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<TextInput
						required
						label={"Email"}
						placeholder="Your Email"
						{...form.getInputProps("email")}
						disabled
						description="You cannot change your email address"
					/>
				</GridCol>
				<GridCol span={{ base: 12 }}>
					<TextInput label={"Phone"} placeholder="Your Phone" {...form.getInputProps("phone")} />
				</GridCol>
				<GridCol span={{ base: 6 }}>
					<Button type="submit" loading={submitted} mt={"md"}>
						{submitted ? "Submitting" : "Submit"}
					</Button>
				</GridCol>
			</Grid>
		</Box>
	);
}
