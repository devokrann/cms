"use client";

import React, { useState } from "react";

import { Box, Button, Center, Grid, GridCol, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import text from "@/libraries/validators/special/text";
import email from "@/libraries/validators/special/email";
import phone from "@/libraries/validators/special/phone";

import { typeFormContact } from "@/types/form";
import { capitalizeWord, capitalizeWords } from "@/handlers/parsers/string";

export default function Contact() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			fname: "",
			lname: "",
			email: "",
			phone: "",
			subject: "",
			message: "",
		},

		validate: {
			fname: value => text(value, 2, 24),
			lname: value => text(value, 2, 24),
			email: value => email(value),
			phone: value => value.trim().length > 0 && phone(value),
			subject: value => text(value, 3, 255, true),
			message: value => text(value, 3, 2048, true),
		},
	});

	const parse = (rawData: typeFormContact) => {
		return {
			fname: capitalizeWord(rawData.fname.trim()),
			lname: capitalizeWord(rawData.lname.trim()),
			email: rawData.email.trim().toLowerCase(),
			phone: rawData.phone?.trim() ? (rawData.phone.trim().length > 0 ? rawData.phone : null) : null,
			subject: capitalizeWords(rawData.subject.trim()),
			message: rawData.message.trim(),
		};
	};

	const handleSubmit = async (formValues: typeFormContact) => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/contact", {
					method: "POST",
					body: JSON.stringify(parse(formValues)),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}).then(res => {
					if (!res) {
						notifications.show({
							id: "form-contact-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						notifications.show({
							id: "form-contact-success",
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Form Submitted",
							message: "Someone will get back to you within 24 hours",
							variant: "success",
						});
					}
				});
			} catch (error) {
				notifications.show({
					id: "form-contact-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Submisstion Failed",
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
			<Grid pb={"md"}>
				<GridCol span={{ base: 12, xs: 6, sm: 12, md: 6 }}>
					<TextInput
						required
						label={"Frist Name"}
						placeholder="Your First Name"
						{...form.getInputProps("fname")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, xs: 6, sm: 12, md: 6 }}>
					<TextInput
						required
						label={"Last Name"}
						placeholder="Your Last Name"
						{...form.getInputProps("lname")}
					/>
				</GridCol>
				<GridCol span={{ base: 12, xs: 6, sm: 12, md: 6 }}>
					<TextInput required label={"Email"} placeholder="Your Email" {...form.getInputProps("email")} />
				</GridCol>
				<GridCol span={{ base: 12, xs: 6, sm: 12, md: 6 }}>
					<TextInput label={"Phone"} placeholder="Your Phone" {...form.getInputProps("phone")} />
				</GridCol>
				<GridCol span={12}>
					<TextInput
						required
						label="Inquiry"
						placeholder="What are you inquiring about?"
						{...form.getInputProps("subject")}
					/>
				</GridCol>
				<GridCol span={12}>
					<Textarea
						required
						label={"Message"}
						placeholder="Write your message here..."
						autosize
						minRows={3}
						maxRows={10}
						{...form.getInputProps("message")}
					/>
				</GridCol>
				<GridCol span={12}>
					<Grid mt={"md"}>
						<GridCol span={{ base: 6 }}>
							{/* <Center>
								<Button
									variant="light"
									fullWidth
									type="reset"
									onClick={() => form.reset()}
									disabled={submitted}
								>
									Clear
								</Button>
							</Center> */}
						</GridCol>
						<GridCol span={{ base: 6 }}>
							<Center>
								<Button fullWidth type="submit" loading={submitted}>
									{submitted ? "Sending" : "Send"}
								</Button>
							</Center>
						</GridCol>
					</Grid>
				</GridCol>
			</Grid>
		</Box>
	);
}
