"use client";

import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { removePost } from "@/handlers/database/posts";
import { PostRelations } from "@/types/model/post";

export default function Delete({
	children,
	post,
	posts,
	setPosts,
}: {
	children: React.ReactNode;
	post: PostRelations;
	posts: PostRelations[];
	setPosts: any;
}) {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);

			const res = await removePost(post);

			if (!res) {
				notifications.show({
					id: `post-${post.id}-delete-failed-no-response`,
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Server Unavailable",
					message: `There was no response from the server.`,
					variant: "failed",
				});
			} else {
				if (!res.post.exists) {
					notifications.show({
						id: `post-${post.id}-delete-failed-not-found`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Post Not Found",
						message: `The post does not exist.`,
						variant: "failed",
					});
				} else {
					// update parent state
					setPosts(
						posts?.filter(p => {
							const key = `${post.title}-${post.user.id}`;
							const keySelected = `${p.title}-${p.user.id}`;

							return key != keySelected;
						})!
					);

					notifications.show({
						id: `post-${post.id}-delete-success`,
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Post Deleted",
						message: `Post has been deleted.`,
						variant: "success",
					});
				}
			}
		} catch (error) {
			notifications.show({
				id: `post-${post.id}-delete-failed`,
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
			<Modal opened={opened} onClose={() => setOpened(false)} title={`Delete Post`} centered>
				<Stack>
					<Text size="sm">Are you sure you want to permanently delete the selected post?</Text>

					<Group justify="end" mt={"md"}>
						<Button size="xs" variant="outline" onClick={() => setOpened(false)}>
							Cancel
						</Button>
						<Button size="xs" color="red" onClick={handleDelete} loading={loading}>
							Delete Post
						</Button>
					</Group>
				</Stack>
			</Modal>

			<div onClick={() => setOpened(true)}>{children}</div>
		</>
	);
}
