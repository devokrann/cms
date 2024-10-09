"use client";

import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { UserGet } from "@/types/model/user";
import { updateUser, updateUsers } from "@/handlers/database/users";
import { StatusUser } from "@prisma/client";

export default function Activate({
	children,
	selection,
	selections,
	users,
	setUsers,
	setSelectedRows,
}: {
	children: React.ReactNode;
	selection?: UserGet;
	selections?: UserGet[];
	users: UserGet[];
	setUsers: any;
	setSelectedRows: any;
}) {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleActivate = async () => {
		try {
			setLoading(true);

			if (selection) {
				const res = await updateUser(selection, StatusUser.ACTIVE);

				if (!res) {
					notifications.show({
						id: `user-${selection.id}-activate-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: `user-${selection.id}-activate-failed-not-found`,
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Not Found",
							message: `No user with that email exists.`,
							variant: "failed",
						});
					} else {
						// update parent state
						setUsers(
							users?.map(u => {
								if (u.id == selection.id) {
									return { ...u, status: StatusUser.ACTIVE };
								} else {
									return u;
								}
							})!
						);

						notifications.show({
							id: `user-${selection.id}-activate-success`,
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Activated",
							message: `${selection.name}'s account has been reactivated.`,
							variant: "success",
						});
					}
				}
			}

			if (selections) {
				const res = await updateUsers(selections, StatusUser.ACTIVE);

				if (!res) {
					notifications.show({
						id: `users-activate-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					// filter out active users
					const filtrate = selections.filter(s => s.status != StatusUser.ACTIVE);

					// update parent state
					setUsers(
						users?.map(u => {
							const currentItem = filtrate.find(s => s.id == u.id);

							if (u.id == currentItem?.id) {
								return { ...u, status: StatusUser.ACTIVE };
							} else {
								return u;
							}
						})!
					);

					notifications.show({
						id: `users-activate-success`,
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Users Activated",
						message: `User accounts have been reactivated.`,
						variant: "success",
					});
				}
			}

			// update parent selection state
			setSelectedRows([]);
		} catch (error) {
			notifications.show({
				id: `users-activate-failed`,
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
	};

	return (
		<>
			<Modal
				opened={opened}
				onClose={() => setOpened(false)}
				title={`Activate User Account${selections ? "s" : ""}`}
				centered
			>
				<Stack>
					<Text size="sm">
						Are you sure you want to activate the user account{selections ? "s" : ""}
						{selection && ` (${selection.email})`}?
					</Text>

					<Text size="sm">
						The user{selections ? "s" : ""} will be granted permission to sign in to their account
						{selections ? "s" : ""}.
					</Text>

					<Group justify="end" mt={"md"}>
						<Button size="xs" variant="outline" onClick={() => setOpened(false)}>
							Cancel
						</Button>
						<Button size="xs" color="green" c={"white"} onClick={handleActivate} loading={loading}>
							Activate Account{selections ? "s" : ""}
						</Button>
					</Group>
				</Stack>
			</Modal>

			<div onClick={() => setOpened(true)}>{children}</div>
		</>
	);
}
