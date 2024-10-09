"use client";

import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { UserGet } from "@/types/model/user";
import { updateUser, updateUsers } from "@/handlers/database/users";
import { StatusUser } from "@prisma/client";

export default function Deactivate({
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

	const handleDeactivate = async () => {
		try {
			setLoading(true);

			if (selection) {
				const res = await updateUser(selection, StatusUser.INACTIVE);

				if (!res) {
					notifications.show({
						id: `user-${selection.id}-deactivate-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.user.exists) {
						notifications.show({
							id: `user-${selection.id}-deactivate-failed-not-found`,
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
									return { ...u, status: StatusUser.INACTIVE };
								} else {
									return u;
								}
							})!
						);

						notifications.show({
							id: `user-${selection.id}-deactivate-success`,
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Deactivated",
							message: `${selection.name}'s account has been deactivated.`,
							variant: "success",
						});
					}
				}
			}

			if (selections) {
				const res = await updateUsers(selections, StatusUser.INACTIVE);

				if (!res) {
					notifications.show({
						id: `users-deactivate-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					// filter out inactive users
					const filtrate = selections.filter(s => s.status != StatusUser.INACTIVE);

					// update parent user state
					setUsers(
						users?.map(u => {
							const currentItem = filtrate.find(s => s.id == u.id);

							if (u.id == currentItem?.id) {
								return { ...u, status: StatusUser.INACTIVE };
							} else {
								return u;
							}
						})!
					);

					notifications.show({
						id: `users-deactivate-success`,
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Users Deactivated",
						message: `User accounts have been deactivated.`,
						variant: "success",
					});
				}
			}

			// update parent selection state
			setSelectedRows([]);
		} catch (error) {
			notifications.show({
				id: `users-deactivate-failed`,
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
				title={`Deactivate User Account${selections ? "s" : ""}`}
				centered
			>
				<Stack>
					<Text size="sm">
						Are you sure you want to deactivate the user account{selections ? "s" : ""}
						{selection && ` (${selection.email})`}?
					</Text>

					<Text size="sm">
						The account{selections ? "s" : ""} will not be deleted, but the user{selections ? "s" : ""} will
						no longer be allowed to sign in until the account{selections ? "s" : ""} {selection && "is"}{" "}
						{selections && "are"} reactivated.
					</Text>

					<Group justify="end" mt={"md"}>
						<Button size="xs" variant="outline" onClick={() => setOpened(false)}>
							Cancel
						</Button>
						<Button size="xs" color="yellow" c={"white"} onClick={handleDeactivate} loading={loading}>
							Deactivate Account{selections ? "s" : ""}
						</Button>
					</Group>
				</Stack>
			</Modal>

			<div onClick={() => setOpened(true)}>{children}</div>
		</>
	);
}
