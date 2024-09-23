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

interface typeFormPost {
	title: string;
	content: string;
	category: string;
	createdAt: Date;

	author: string;
	tags: string[];
}

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

			author: "",
			category: "",
			tags: [""],
		},

		validate: {
			title: hasLength({ min: 2, max: 64 }, "Between 2 and 64 characters"),
			author: value => userId.length < 1 && "Select an author",
			tags: value => postTags.length < 1 && "Select or create some tags",
		},
	});

	const parse = (rawData: typeFormPost) => {
		return {
			title: rawData.title.trim(),
			content: rawData.content.trim(),
			createdAt: rawData.createdAt,

			author: rawData.author.trim(),
			category: rawData.category.trim(),
			tags: rawData.tags,
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/post", {
					method: enumRequest.POST,
					body: JSON.stringify(parse(form.values)),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}).then(res => {
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
						notifications.show({
							id: "blog-post-create-success",
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Post Created",
							message: `The post has been added`,
							variant: "success",
						});
					}
				});
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
				// form.reset();
				setSubmitted(false);
			}
		}
	};

	useEffect(() => {
		if (form.isDirty()) {
			form.setValues({ ...form.values, author: userId });
			form.validate();
		}
	}, [userId]);

	useEffect(() => {
		if (form.isDirty()) {
			form.setValues({ ...form.values, tags: postTags });
			form.validate();
		}
	}, [postTags]);

	useEffect(() => {
		if (form.isDirty()) {
			form.setValues({ ...form.values, content: postContent });
			form.validate();
		}
	}, [postContent]);

	useEffect(() => {
		if (form.isDirty()) {
			form.setValues({ ...form.values, category: postCategory });
			form.validate();
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
											{...form.getInputProps("author")}
											required
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
							<InputContentBlog hoistChange={handleContentChange} />
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
										{...form.getInputProps("category")}
									/>
								</GridCol>
								<GridCol span={12}>
									<InputTagBlog
										label="Tags"
										description="Select tags or enter new"
										placeholder="Post Tags"
										hoistChange={handleTagsChange}
										{...form.getInputProps("tags")}
									/>
								</GridCol>
							</Grid>
						</Fieldset>
					</Stack>
				</GridCol>

				<GridCol span={12}>
					<Group mt={"md"}>
						<Button variant="light" type="reset" onClick={() => form.reset()} disabled={submitted}>
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
