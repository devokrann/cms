"use client";

import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { typeUser } from "@/types/user";
import { enumRequest } from "@/types/enums";

export default function Delete({ children, data }: { children: React.ReactNode; data: typeUser }) {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);

			const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user", {
				method: enumRequest.DELETE,
				body: JSON.stringify(data.id),
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const res = await response.json();

			if (!res) {
				notifications.show({
					id: `user-${data.id}-delete-failed-no-response`,
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Server Unavailable",
					message: `There was no response from the server.`,
					variant: "failed",
				});
			} else {
				if (!res.user.exists) {
					notifications.show({
						id: `user-${data.id}-delete-failed-not-found`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "User Not Found",
						message: `No user with that email exists.`,
						variant: "failed",
					});
				} else {
					notifications.show({
						id: `user-${data.id}-delete-success`,
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "User Deleted",
						message: `${data.name} has been deleted.`,
						variant: "success",
					});
				}
			}
		} catch (error) {
			notifications.show({
				id: `user-${data.id}-delete-failed`,
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
				title={`Delete ${data.name ? data.name : "User"}`}
				centered
			>
				<Stack>
					<Text size="sm">Are you sure you want to permanently delete the user ({data.email})?</Text>

					<Group justify="end">
						<Button size="xs" variant="outline" onClick={() => setOpened(false)}>
							Cancel
						</Button>
						<Button size="xs" color="red" onClick={handleDelete} loading={loading}>
							Delete
						</Button>
					</Group>
				</Stack>
			</Modal>

			<div onClick={() => setOpened(true)}>{children}</div>
		</>
	);
}
