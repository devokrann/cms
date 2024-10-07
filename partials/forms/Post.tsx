"use client";

import React, { useEffect, useState } from "react";

import { Box, Button, Fieldset, Grid, GridCol, Group, Stack, TextInput } from "@mantine/core";

import { DateInput } from "@mantine/dates";

import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX } from "@tabler/icons-react";

import DropzonePost from "@/components/dropezones/Post";
import { enumRequest } from "@/types/enums";
import InputSearchUser from "@/components/inputs/search/User";
import InputTagBlog from "@/components/inputs/tag/Blog";
import InputContentBlog from "@/components/inputs/content/Blog";
import InputCategoryBlog from "@/components/inputs/category/Blog";
import { PostRelations } from "@/types/model/post";

export default function Post() {
	// Step 1: Manage the input value state
	const [userId, setUserId] = useState<string>("");
	const [postCategory, setPostCategory] = useState<string>("");
	const [postTags, setPostTags] = useState<string[]>([]);
	const [postContent, setPostContent] = useState<string>("");

	// Step 2: Handle input change
	const handleUserChange = (value: string) => {
		setUserId(value);
	};
	const handleTagsChange = (value: string[]) => {
		setPostTags(value);
	};
	const handleContentChange = (value: string) => {
		setPostContent(value);
	};
	const handleCategoryChange = (value: string) => {
		setPostCategory(value);
	};

	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			title: "",
			content: "",
			createdAt: new Date(),

			userId: "",
			categoryId: "",
			tags: [""],
		},

		validate: {
			title: hasLength({ min: 2, max: 120 }, "Between 2 and 120 characters"),
			userId: hasLength({ min: 2, max: 64 }, "Select an author"),
		},
	});

	const parse = () => {
		return {
			title: form.values.title.trim(),
			content: form.values.content,
			createdAt: form.values.createdAt,

			userId: form.values.userId,
			categoryId: form.values.categoryId == "clear" ? "" : form.values.categoryId,
			tags:
				form.values.tags.map((t: string) => {
					return { title: t };
				})[0].title == "clear"
					? []
					: form.values.tags.map(t => {
							return { title: t };
					  }),
		};
	};

	const handleReset = () => {
		// clear internal elements
		form.reset();

		// clear external elements
		setUserId("clear");
		setPostContent("clear");
		setPostCategory("clear");
		setPostTags(["clear"]);
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			if (postContent.trim().length > 16) {
				try {
					setSubmitted(true);

					const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/post", {
						method: enumRequest.POST,
						body: JSON.stringify(parse()),
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
					});

					const res = await response.json();

					if (!res) {
						notifications.show({
							id: "blog-post-create-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						if (!res.post.exists) {
							notifications.show({
								id: "blog-post-create-success",
								icon: <IconCheck size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Post Created",
								message: `The post has been added`,
								variant: "success",
							});
						} else {
							notifications.show({
								id: "blog-post-create-failed-exists",
								icon: <IconX size={16} stroke={1.5} />,
								autoClose: 5000,
								title: "Post Exists",
								message: `That Title-Author combination already exists.`,
								variant: "failed",
							});
						}
					}
				} catch (error) {
					notifications.show({
						id: "blog-post-create-failed",
						icon: <IconX size={16} stroke={1.5} />,
						autoClose: 5000,
						title: "Submisstion Failed",
						message: (error as Error).message,
						variant: "failed",
					});
				} finally {
					// reset from
					handleReset();
					setSubmitted(false);
				}
			} else {
				notifications.show({
					id: "blog-post-create-failed-content",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Content Required",
					message: "Add blog post content",
					variant: "failed",
				});
			}
		}
	};

	useEffect(() => {
		if (userId !== form.values.userId) {
			form.setFieldValue("userId", userId);
			// form.validate(); // Trigger form validation after updating
		}
	}, [userId]);

	useEffect(() => {
		if (postTags !== form.values.tags) {
			form.setFieldValue("tags", postTags);
			// form.validate(); // Trigger form validation after updating
		}
	}, [postTags]);

	useEffect(() => {
		if (postContent !== form.values.content) {
			form.setFieldValue("content", postContent);
			// form.validate(); // Trigger form validation after updating
		}
	}, [postContent]);

	useEffect(() => {
		if (postCategory !== form.values.categoryId) {
			form.setFieldValue("categoryId", postCategory);
			// form.validate(); // Trigger form validation after updating
		}
	}, [postCategory]);

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit())} noValidate>
			<Grid>
				<GridCol span={{ base: 12, md: 8 }}>
					<Grid>
						<GridCol span={12}>
							<Fieldset legend="Post Details">
								<Grid>
									<GridCol span={12}>
										<TextInput
											required
											label={"Title"}
											placeholder={"Post Title"}
											{...form.getInputProps("title")}
										/>
									</GridCol>
									<GridCol span={{ base: 12, md: 6 }}>
										<InputSearchUser
											label={"Author"}
											placeholder={"Post Author"}
											hoistChange={handleUserChange}
											{...form.getInputProps("userId")}
											required
											initialValue={userId}
											autoComplete="off"
										/>
									</GridCol>
									<GridCol span={{ base: 12, md: 6 }}>
										<DateInput
											required
											label={"Publication Date"}
											placeholder={"Post Publication Date"}
											{...form.getInputProps("createdAt")}
										/>
									</GridCol>
								</Grid>
							</Fieldset>
						</GridCol>

						<GridCol span={12}>
							<InputContentBlog hoistChange={handleContentChange} initialValue={postContent} />
						</GridCol>
					</Grid>
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<Stack pos={"sticky"} top={"var(--mantine-spacing-lg)"}>
						<Fieldset legend="Post Image">
							<DropzonePost />
						</Fieldset>

						<Fieldset legend="Metadata">
							<Grid>
								<GridCol span={12}>
									<InputCategoryBlog
										label="Category"
										description="Search a category or enter new"
										placeholder="Post Category"
										hoistChange={handleCategoryChange}
										{...form.getInputProps("categoryId")}
										initialValue={postCategory}
										autoComplete="off"
									/>
								</GridCol>
								<GridCol span={12}>
									<InputTagBlog
										label="Tags"
										description="Select tags or enter new"
										placeholder="Post Tags"
										hoistChange={handleTagsChange}
										{...form.getInputProps("tags")}
										initialValue={postTags}
										autoComplete="off"
									/>
								</GridCol>
							</Grid>
						</Fieldset>
					</Stack>
				</GridCol>

				<GridCol span={12}>
					<Group mt={"md"}>
						<Button variant="light" type="reset" onClick={handleReset} disabled={submitted}>
							Cancel
						</Button>

						<Button type="submit" loading={submitted}>
							{submitted ? "Sending" : "Send"}
						</Button>
					</Group>
				</GridCol>
			</Grid>
		</Box>
	);
}
