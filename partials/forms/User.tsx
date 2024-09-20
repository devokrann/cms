"use client";

import React, { useState } from "react";

import { Box, Button, Fieldset, Grid, GridCol, Group, PasswordInput, Select, TextInput } from "@mantine/core";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import email from "@/libraries/validators/special/email";

import { capitalizeWord, capitalizeWords } from "@/handlers/parsers/string";
import { enumUserRole } from "@/types/enums";
import password from "@/libraries/validators/special/password";
import compare from "@/libraries/validators/special/compare";
import { enumRequest } from "@/types/enums";

interface typeFormUser {
	name: string;
	email: string;
	password: string;
	passwordConfirm: string;
	role: string;
	phone: string;
}

export default function User() {
	const [submitted, setSubmitted] = useState(false);

	const userRoles = [
		capitalizeWord(enumUserRole.USER),
		capitalizeWord(enumUserRole.ADMIN),
		capitalizeWord(enumUserRole.DEV),
	];

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			password: "",
			passwordConfirm: "",
			role: userRoles[0],
			phone: "",
		},

		validate: {
			name: hasLength({ min: 0, max: 24 }, "Between 2 and 24 characters"),
			email: value => email(value),
			password: value => password(value.trim(), 8, 24),
			passwordConfirm: (value, values) => compare.string(values.password, value, "Password"),
			role: hasLength({ min: 1, max: 24 }, "Select a role"),
			phone: hasLength({ min: 0, max: 13 }, "Between 10 and 13 characters"),
		},
	});

	const parse = (rawData: typeFormUser) => {
		return {
			role: rawData.role.toUpperCase(),
			password: rawData.password.trim(),
			name: capitalizeWords(rawData.name!.trim()),
			email: rawData.email.trim().toLowerCase(),
			phone: rawData.phone,
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user", {
					method: enumRequest.POST,
					body: JSON.stringify(parse(form.values)),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				});

				const res = await response.json();

				if (!res) {
					notifications.show({
						id: "form-user-create-failed-no-response",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: "form-user-create-success",
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Created",
							message: `${parse(form.values).name} has been added`,
							variant: "success",
						});
					} else {
						notifications.show({
							id: "form-user-create-failed-exists",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Exists",
							message: `A user with that email already exists.`,
							variant: "failed",
						});
					}
				}
			} catch (error) {
				notifications.show({
					id: "form-user-create-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
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
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit())} noValidate>
			<Grid>
				<GridCol span={{ base: 12, md: 6, lg: 5 }}>
					<Fieldset legend="Account Information">
						<Grid pb={"md"}>
							<GridCol span={{ base: 12 }}>
								<Select
									required
									label={"Role"}
									placeholder={"User Role"}
									{...form.getInputProps("role")}
									data={userRoles}
								/>
							</GridCol>

							<GridCol span={{ base: 12 }}>
								<TextInput
									required
									label={"Email"}
									placeholder="User Email"
									{...form.getInputProps("email")}
								/>
							</GridCol>

							<GridCol span={{ base: 12 }}>
								<PasswordInput
									required
									label={"Password"}
									placeholder="User password"
									{...form.getInputProps("password")}
								/>
							</GridCol>

							<GridCol span={{ base: 12 }}>
								<PasswordInput
									required
									label={"Confirm Password"}
									placeholder="Confirm user password"
									{...form.getInputProps("passwordConfirm")}
								/>
							</GridCol>
						</Grid>
					</Fieldset>
				</GridCol>

				<GridCol span={{ base: 12, md: 6, lg: 5 }}>
					<Fieldset legend="Profile Details">
						<Grid pb={"md"}>
							<GridCol span={{ base: 12 }}>
								<TextInput label={"Name"} placeholder="User Name" {...form.getInputProps("name")} />
							</GridCol>

							<GridCol span={{ base: 12 }}>
								<TextInput label={"Phone"} placeholder="User Phone" {...form.getInputProps("phone")} />
							</GridCol>
						</Grid>
					</Fieldset>
				</GridCol>

				<GridCol span={12}>
					<Group mt={"md"}>
						<Button variant="light" type="reset" onClick={() => form.reset()} disabled={submitted}>
							Cancel
						</Button>

						<Button type="submit" loading={submitted}>
							{submitted ? "Sending" : "Send"}
						</Button>
					</Group>
				</GridCol>
			</Grid>
		</Box>
	);
}
