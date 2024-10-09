"use client";

import React, { useState } from "react";

import {
	Box,
	Button,
	Fieldset,
	Grid,
	GridCol,
	Group,
	PasswordInput,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Textarea,
	TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import email from "@/libraries/validators/special/email";

import { capitalizeWord } from "@/handlers/parsers/string";
import { StatusUser } from "@prisma/client";
import { UserRole } from "@prisma/client";
import password from "@/libraries/validators/special/password";
import compare from "@/libraries/validators/special/compare";
import { enumRequest } from "@/types/enums";
import DropzoneUser from "@/components/dropezones/User";
import text from "@/libraries/validators/special/text";

interface typeFormUser {
	account: {
		role: string;
		status: string;
		email: string;
		password: string;
		passwordConfirm: string;
	};

	profile: {
		name: { first: string; last: string };
		bio: string;
		phone: string;
		address?: string;
		city?: string;
		state?: string;
		country?: string;
	};
}

export default function User() {
	const [submitted, setSubmitted] = useState(false);

	const userRoles = [
		capitalizeWord(UserRole.USER),
		capitalizeWord(UserRole.ADMINISTRATOR),
		capitalizeWord(UserRole.DEVELOPER),
	];

	const userStatus = [capitalizeWord(StatusUser.ACTIVE), capitalizeWord(StatusUser.INACTIVE)];

	const form = useForm({
		initialValues: {
			account: {
				role: userRoles[0],
				status: userStatus[0],

				email: "",
				password: "",
				passwordConfirm: "",
			},
			profile: {
				name: { first: "", last: "" },
				bio: "",
				phone: "",
				address: "",
				city: "",
				state: "",
				country: "",
			},
		},

		validate: {
			account: {
				email: value => email(value),
				password: value => password(value.trim(), 8, 24),
				passwordConfirm: (value, values) => compare.string(values.account.password, value, "Password"),
			},

			profile: {
				name: {
					first: value => value.trim().length > 0 && text(value.trim(), 2, 24),
					last: value => value.trim().length > 0 && text(value.trim(), 2, 24),
				},
				bio: value => value.trim().length > 0 && text(value.trim(), 2, 2048, true),
				phone: value => value.trim().length > 0 && text(value.trim(), 10, 13, true),
				address: value => value.trim().length > 0 && text(value.trim(), 2, 48, true),
				city: value => value.trim().length > 0 && text(value.trim(), 2, 24),
				state: value => value.trim().length > 0 && text(value.trim(), 2, 24),
				country: value => value.trim().length > 0 && text(value.trim(), 2, 48),
			},
		},
	});

	const parse = (rawData: typeFormUser) => {
		return {
			account: {
				role: rawData.account.role.toUpperCase(),
				status: rawData.account.status.toUpperCase(),

				email: rawData.account.email.trim().toLowerCase(),
				password: rawData.account.password.trim(),
			},
			profile: {
				name: {
					first: capitalizeWord(rawData.profile.name.first.trim()),
					last: capitalizeWord(rawData.profile.name.last.trim()),
				},
				bio: rawData.profile.bio.trim(),
				phone: rawData.profile.phone.trim(),
				address: rawData.profile.address?.trim(),
				city: rawData.profile.city?.trim(),
				state: rawData.profile.state?.trim(),
				country: rawData.profile.country?.trim(),
			},
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
							message: `User details have been added`,
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
				<GridCol span={{ base: 12, md: 8 }}>
					<Grid>
						<GridCol span={12}>
							<Fieldset legend="Account Details">
								<Grid>
									<GridCol span={{ base: 12 }}>
										<Select
											required
											label={"Role"}
											placeholder={"User Role"}
											{...form.getInputProps("account.role")}
											data={userRoles}
											allowDeselect={false}
											withCheckIcon={false}
										/>
									</GridCol>

									<GridCol span={{ base: 12 }}>
										<TextInput
											required
											label={"Email"}
											placeholder="User Email"
											{...form.getInputProps("account.email")}
										/>
									</GridCol>

									<GridCol span={{ base: 12 }}>
										<PasswordInput
											required
											label={"Password"}
											placeholder="User password"
											{...form.getInputProps("account.password")}
										/>
									</GridCol>

									<GridCol span={{ base: 12 }}>
										<PasswordInput
											required
											label={"Confirm Password"}
											placeholder="Confirm user password"
											{...form.getInputProps("account.passwordConfirm")}
										/>
									</GridCol>
								</Grid>
							</Fieldset>
						</GridCol>

						<GridCol span={12}>
							<Fieldset legend="Profile Details">
								<Grid pb={"md"}>
									<GridCol span={{ base: 12, md: 6 }}>
										<TextInput
											label={"First Name"}
											placeholder="User Frist Name"
											{...form.getInputProps("profile.name.first")}
										/>
									</GridCol>

									<GridCol span={{ base: 12, md: 6 }}>
										<TextInput
											label={"Last Name"}
											placeholder="User Last Name"
											{...form.getInputProps("profile.name.last")}
										/>
									</GridCol>

									<GridCol span={{ base: 12 }}>
										<Textarea
											label={"Bio"}
											placeholder="User Bio"
											{...form.getInputProps("profile.bio")}
											autosize
											minRows={2}
											maxRows={4}
											resize="vertical"
										/>
									</GridCol>

									<GridCol span={{ base: 12 }}>
										<TextInput
											label={"Address"}
											placeholder="User Address"
											{...form.getInputProps("profile.address")}
										/>
									</GridCol>

									<GridCol span={{ base: 12, md: 6 }}>
										<TextInput
											label={"Phone"}
											placeholder="User Phone"
											{...form.getInputProps("profile.phone")}
										/>
									</GridCol>

									<GridCol span={{ base: 12, md: 6 }}>
										<TextInput
											label={"City"}
											placeholder="User City"
											{...form.getInputProps("profile.city")}
										/>
									</GridCol>

									<GridCol span={{ base: 12, md: 6 }}>
										<TextInput
											label={"State/Province"}
											placeholder="User State"
											{...form.getInputProps("profile.state")}
										/>
									</GridCol>

									<GridCol span={{ base: 12, md: 6 }}>
										<TextInput
											label={"Country"}
											placeholder="User Country"
											{...form.getInputProps("profile.country")}
										/>
									</GridCol>
								</Grid>
							</Fieldset>
						</GridCol>
					</Grid>
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<Grid pos={"sticky"} top={"var(--mantine-spacing-lg)"}>
						<GridCol span={12}>
							<Fieldset legend="User Image">
								<DropzoneUser />
							</Fieldset>
						</GridCol>

						<GridCol span={12}>
							<Fieldset legend="Account Status">
								<RadioGroup defaultValue={userStatus[0]} {...form.getInputProps("account.status")}>
									<Stack>
										{userStatus.map(i => (
											<Radio key={i} value={i} label={capitalizeWord(i)} />
										))}
									</Stack>
								</RadioGroup>
							</Fieldset>
						</GridCol>
					</Grid>
				</GridCol>

				<GridCol span={12}>
					<Group>
						<Button variant="light" type="reset" onClick={() => form.reset()} disabled={submitted}>
							Clear
						</Button>

						<Button type="submit" loading={submitted}>
							{submitted ? "Creating" : "Create"}
						</Button>
					</Group>
				</GridCol>
			</Grid>
		</Box>
	);
}
