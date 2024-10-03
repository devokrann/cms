"use client";

import React, { useState } from "react";
import { Anchor, Button, Checkbox, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { UserGet } from "@/types/model/user";
import { removeUser } from "@/handlers/database/users";
import contact from "@/data/contact";
import { useForm } from "@mantine/form";

export default function Delete({
	children,
	user,
	users,
	setUsers,
}: {
	children: React.ReactNode;
	user: UserGet;
	users: UserGet[];
	setUsers: any;
}) {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		if (!form.isValid()) {
			form.validate();
		} else {
			try {
				setLoading(true);

				const res = await removeUser(user);

				if (!res) {
					notifications.show({
						id: `user-${user.id}-delete-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: `user-${user.id}-delete-failed-not-found`,
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Not Found",
							message: `No user with that email exists.`,
							variant: "failed",
						});
					} else {
						// update parent state
						setUsers(users?.filter(u => u.id != user.id)!);

						notifications.show({
							id: `user-${user.id}-delete-success`,
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Deleted",
							message: `${user.name} has been deleted.`,
							variant: "success",
						});
					}
				}
			} catch (error) {
				notifications.show({
					id: `user-${user.id}-delete-failed`,
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Unexpected Error",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				setLoading(false);
				setOpened(false);
			}
		}
	};

	const form = useForm({
		initialValues: {
			phrase: "",
			regulations: false,
		},

		validate: {
			phrase: value => value.trim() != "DELETE" && "Please enter DELETE to proceed",
			regulations: value => !value && "Please acknowledge the regulations",
		},
	});

	const gdpr = (
		<Anchor inherit href={contact.externalLinks.gdpr} target="_blank" underline="never">
			<abbr title="General Data Protection Regulation">GDPR</abbr>
		</Anchor>
	);

	return (
		<>
			<Modal opened={opened} onClose={() => setOpened(false)} title={`Delete User Account`} centered>
				<Stack>
					<Text size="sm">
						Are you sure you want to permanently delete the user&apos;s account ({user.email})?
					</Text>
					<Text size="sm">
						The deletion process complies with the European Union&apos;s {gdpr}, which requires this
						platform to permanently delete the user&apos;s account and all data related to it.
					</Text>
					<Text size="sm">
						It is <strong>strongly recommended</strong> to leave the account deactivated instead for future
						recovery. Otherwise, this action is irrevocable. Proceed with caution.
					</Text>

					<form onSubmit={form.onSubmit(values => handleDelete)}>
						<Stack>
							<TextInput
								withAsterisk
								label="Confirmation Phrase"
								placeholder="Enter DELETE to confirm"
								key={form.key("phrase")}
								{...form.getInputProps("phrase")}
							/>
							<Checkbox
								key={form.key("regulations")}
								{...form.getInputProps("regulations", { type: "checkbox" })}
								label={
									<Text component="span" inherit>
										I know about the {gdpr} regulations
									</Text>
								}
								size="xs"
								color="red"
								ml={"md"}
							/>

							<Group justify="end" mt={"md"}>
								<Button
									size="xs"
									variant="outline"
									onClick={() => {
										setOpened(false);
										form.reset();
									}}
								>
									Leave Deactivated
								</Button>
								<Button size="xs" color="red" onClick={handleDelete} loading={loading}>
									Delete Account
								</Button>
							</Group>
						</Stack>
					</form>
				</Stack>
			</Modal>

			<div onClick={() => setOpened(true)}>{children}</div>
		</>
	);
}
