"use client";

import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { removePost } from "@/handlers/database/posts";
import { PostGet } from "@/types/model/post";

export default function Delete({ children, data }: { children: React.ReactNode; data: PostGet }) {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);

			const response = await removePost(data);

			const res = await response.json();

			if (!res) {
				notifications.show({
					id: `post-${data.id}-delete-failed-no-response`,
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Server Unavailable",
					message: `There was no response from the server.`,
					variant: "failed",
				});
			} else {
				if (!res.user.exists) {
					notifications.show({
						id: `post-${data.id}-delete-failed-not-found`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "User Not Found",
						message: `No user with that email exists.`,
						variant: "failed",
					});
				} else {
					notifications.show({
						id: `post-${data.id}-delete-success`,
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "User Deleted",
						message: `Post has been deleted.`,
						variant: "success",
					});
				}
			}
		} catch (error) {
			notifications.show({
				id: `post-${data.id}-delete-failed`,
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
			<Modal opened={opened} onClose={() => setOpened(false)} title={`Delete ${data.title}`} centered>
				<Stack>
					<Text size="sm">Are you sure you want to permanently delete the post ({data.title})?</Text>

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
