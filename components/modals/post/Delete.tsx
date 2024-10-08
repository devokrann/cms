"use client";

import React, { useState } from "react";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { removePost, removePosts } from "@/handlers/database/posts";
import { PostRelations } from "@/types/model/post";

export default function Delete({
	children,
	selection,
	selections,
	posts,
	setPosts,
	setSelectedRows,
}: {
	children: React.ReactNode;
	selection?: PostRelations;
	selections?: PostRelations[];
	posts: PostRelations[];
	setPosts: any;
	setSelectedRows: any;
}) {
	const [opened, setOpened] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleDelete = async () => {
		try {
			setLoading(true);

			if (selection) {
				const res = await removePost(selection);

				if (!res) {
					notifications.show({
						id: `post-${selection.id}-delete-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.post.exists) {
						notifications.show({
							id: `post-${selection.id}-delete-failed-not-found`,
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Post Not Found",
							message: `The post does not exist.`,
							variant: "failed",
						});
					} else {
						// update parent state
						setPosts(posts?.filter(p => p.id != selection.id)!);

						notifications.show({
							id: `post-${selection.id}-delete-success`,
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Post Deleted",
							message: `Post has been deleted.`,
							variant: "success",
						});
					}
				}
			}

			if (selections) {
				const res = await removePosts(selections);

				if (!res) {
					notifications.show({
						id: `posts-delete-failed-no-response`,
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					// update parent state
					setPosts(posts?.filter(p => p.id != selections.find(s => s.id == p.id)?.id)!);

					notifications.show({
						id: `posts-delete-success`,
						icon: <IconCheck size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Posts Deleted",
						message: `The posts have been deleted.`,
						variant: "success",
					});
				}
			}

			// update parent selection state
			setSelectedRows([]);
		} catch (error) {
			notifications.show({
				id: `posts-delete-failed`,
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
				title={`Delete Post${selections ? "s" : ""}`}
				centered
			>
				<Stack>
					<Text size="sm">
						Are you sure you want to permanently delete the selected post{selections && "s"}?
					</Text>

					<Group justify="end" mt={"md"}>
						<Button size="xs" variant="outline" onClick={() => setOpened(false)}>
							Cancel
						</Button>
						<Button size="xs" color="red" onClick={handleDelete} loading={loading}>
							Delete Post{selections && "s"}
						</Button>
					</Group>
				</Stack>
			</Modal>

			<div onClick={() => setOpened(true)}>{children}</div>
		</>
	);
}
