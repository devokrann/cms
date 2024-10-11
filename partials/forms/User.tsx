"use client";

import React, { useState } from "react";

import {
	Box,
	Button,
	Checkbox,
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

import { capitalizeWord, capitalizeWords } from "@/handlers/parsers/string";
import { StatusUser } from "@prisma/client";
import { UserRole } from "@prisma/client";
import password from "@/libraries/validators/special/password";
import compare from "@/libraries/validators/special/compare";
import DropzoneUser from "@/components/dropezones/User";
import text from "@/libraries/validators/special/text";
import values from "@/data/values";
import { FormUserCreate } from "@/types/form";
import { addUser } from "@/handlers/database/users";

export default function User() {
	const [submitted, setSubmitted] = useState(false);

	const [profileDetails, setProfileDetails] = useState(false);

	const userRoles = [
		{ label: capitalizeWord(UserRole.USER), value: UserRole.USER },
		{ label: capitalizeWord(UserRole.ADMINISTRATOR), value: UserRole.ADMINISTRATOR },
		{ label: capitalizeWord(UserRole.DEVELOPER), value: UserRole.DEVELOPER },
	];

	const userStatus = [
		{ label: capitalizeWord(StatusUser.ACTIVE), value: StatusUser.ACTIVE },
		{ label: capitalizeWord(StatusUser.INACTIVE), value: StatusUser.INACTIVE },
	];

	const form = useForm({
		initialValues: {
			name: "",
			email: "",
			password: "",
			passwordConfirm: "",

			role: userRoles[0].value,
			status: userStatus[0].value,

			profile: {
				firstName: "",
				lastName: "",
				bio: "",
				phone: "",
				address: "",
				city: "",
				state: "",
				country: "",
			},
		},

		validate: {
			email: value => email(value),
			password: value => password(value.trim(), 8, 24),
			passwordConfirm: (value, values) => compare.string(values.password, value, "Password"),

			profile: !profileDetails
				? undefined
				: {
						firstName: value => text(value.trim(), 2, 24),
						lastName: value => text(value.trim(), 2, 24),
						bio: value => value.trim().length > 0 && text(value.trim(), 2, 2048, true),
						phone: value => value.trim().length > 0 && text(value.trim(), 10, 13, true),
						address: value => value.trim().length > 0 && text(value.trim(), 2, 48, true),
						city: value => value.trim().length > 0 && text(value.trim(), 2, 24),
						state: value => value.trim().length > 0 && text(value.trim(), 2, 24),
						country: value => value.trim().length > 0 && text(value.trim(), 2, 48),
				  },
		},
	});

	const parse = (): FormUserCreate => {
		const fullName = `${capitalizeWords(form.values.profile.firstName.trim())} ${capitalizeWords(
			form.values.profile.lastName.trim()
		)}`;

		return {
			name: profileDetails && fullName.trim().length > 0 ? fullName : null,
			email: form.values.email.trim().toLowerCase(),
			password: form.values.password.trim(),

			role: form.values.role,
			status: form.values.status,

			profile: !profileDetails
				? undefined
				: {
						firstName:
							form.values.profile.firstName.trim().length > 0
								? capitalizeWord(form.values.profile.firstName.trim())
								: null,
						lastName:
							form.values.profile.lastName.trim().length > 0
								? capitalizeWord(form.values.profile.lastName.trim())
								: null,
						bio: form.values.profile.bio.trim().length > 0 ? form.values.profile.bio.trim() : null,
						phone: form.values.profile.phone.trim().length > 0 ? form.values.profile.phone.trim() : null,
						address:
							form.values.profile.address?.trim().length > 0 ? form.values.profile.address?.trim() : null,
						city: form.values.profile.city?.trim().length > 0 ? form.values.profile.city?.trim() : null,
						state: form.values.profile.state?.trim().length > 0 ? form.values.profile.state?.trim() : null,
						country:
							form.values.profile.country?.trim().length > 0 ? form.values.profile.country?.trim() : null,
				  },
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				const res = await addUser(parse());

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

					form.reset();
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
											{...form.getInputProps("role")}
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

						<GridCol span={12}>
							<Checkbox
								label="Include profile details"
								checked={profileDetails}
								onChange={event => setProfileDetails(event.currentTarget.checked)}
							/>
						</GridCol>

						{profileDetails && (
							<GridCol span={12}>
								<Fieldset legend="Profile Details">
									<Grid pb={"md"}>
										<GridCol span={{ base: 12, md: 6 }}>
											<TextInput
												label={"First Name"}
												placeholder="User Frist Name"
												{...form.getInputProps("profile.firstName")}
											/>
										</GridCol>

										<GridCol span={{ base: 12, md: 6 }}>
											<TextInput
												label={"Last Name"}
												placeholder="User Last Name"
												{...form.getInputProps("profile.lastName")}
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
						)}
					</Grid>
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<Grid pos={"sticky"} top={`calc(${values.headerHeight}px + var(--mantine-spacing-lg))`}>
						<GridCol span={12}>
							<Fieldset legend="User Image">
								<DropzoneUser />
							</Fieldset>
						</GridCol>

						<GridCol span={12}>
							<Fieldset legend="Account Status">
								<RadioGroup defaultValue={userStatus[0].value} {...form.getInputProps("status")}>
									<Stack>
										{userStatus.map(i => (
											<Radio key={i.value} value={i.value} label={i.label} />
										))}
									</Stack>
								</RadioGroup>
							</Fieldset>
						</GridCol>
					</Grid>
				</GridCol>

				<GridCol span={12} mt={"md"}>
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
