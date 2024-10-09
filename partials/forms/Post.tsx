"use client";

import React, { useEffect, useState } from "react";

import {
	Alert,
	Box,
	Button,
	Fieldset,
	Grid,
	GridCol,
	Group,
	Loader,
	Stack,
	Switch,
	TextInput,
	Transition,
} from "@mantine/core";

import { DateInput } from "@mantine/dates";

import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import {
	IconAlertTriangle,
	IconArrowUpRight,
	IconCheck,
	IconInfoCircle,
	IconNotes,
	IconSend,
	IconX,
} from "@tabler/icons-react";

import DropzonePost from "@/components/dropezones/Post";
import { enumRequest } from "@/types/enums";
import InputSearchUser from "@/components/inputs/search/User";
import InputTagBlog from "@/components/inputs/tag/Blog";
import InputContentBlog from "@/components/inputs/content/Blog";
import InputCategoryBlog from "@/components/inputs/category/Blog";
import { PostRelations } from "@/types/model/post";
import values from "@/data/values";
import { StatusPost } from "@prisma/client";

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
	const [drafted, setDrafted] = useState(false);

	const [info, setInfo] = useState(true);
	const [warning, setWarning] = useState(true);
	const [view, setView] = useState(false);

	const form = useForm({
		initialValues: {
			title: "",
			content: "",
			comments: true,
			anonymous: false,

			userId: "",
			categoryId: "",
			tags: [] as string[],
		},

		validate: {
			title: hasLength({ min: 2, max: 120 }, "Between 2 and 120 characters"),
			userId: (value, values) =>
				!values.anonymous && (value.trim().length < 1 || value.trim() == "clear") && "Select an author",
			content: hasLength({ min: 24, max: 9999 }, "Post content is required"),
		},
	});

	const parse = () => {
		return {
			title: form.values.title.trim(),
			content: form.values.content,
			allowComments: form.values.comments,
			anonymous: form.values.anonymous,

			userId: !form.values.anonymous ? form.values.userId : "",
			categoryId: form.values.categoryId == "clear" ? "" : form.values.categoryId,
			tags:
				form.values.tags.map(t => {
					return { title: t };
				})[0].title == "clear"
					? []
					: form.values.tags.map(t => {
							return { title: t };
					  }),
		};
	};

	const handleReset = () => {
		// clear external elements
		setUserId("clear");
		setPostContent("clear");
		setPostCategory("clear");
		setPostTags(["clear"]);

		// clear internal elements
		form.reset();
	};

	const handleSubmit = async (draft: boolean = false) => {
		if (form.isValid()) {
			try {
				if (!draft) {
					setSubmitted(true);
				} else {
					setDrafted(true);
				}

				const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/post", {
					method: enumRequest.POST,
					body: JSON.stringify({ ...parse(), status: draft ? StatusPost.DRAFT : StatusPost.PUBLISHED }),
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
						title: "Server Unavailable",
						message: `There was no response from the server.`,
						variant: "failed",
					});
				} else {
					if (!res.post.exists) {
						notifications.show({
							id: "blog-post-create-success",
							icon: <IconCheck size={16} stroke={1.5} />,
							title: `${draft ? "Draft Saved" : "Post Published"}`,
							message: `The post has been ${draft ? "saved as a draft" : "published"}`,
							variant: "success",
						});

						// reset from
						handleReset();

						// show view button
						setView(true);
						setTimeout(() => {
							setView(false);
						}, 5000);
					} else {
						notifications.show({
							id: "blog-post-create-failed-exists",
							icon: <IconX size={16} stroke={1.5} />,
							title: "Post Exists",
							message: `${
								parse().userId
									? "That Title-Author combination already exists."
									: "A post with that title already exists."
							}`,
							variant: "failed",
						});
					}
				}
			} catch (error) {
				notifications.show({
					id: "blog-post-create-failed",
					icon: <IconX size={16} stroke={1.5} />,
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				setSubmitted(false);
				setDrafted(false);
			}
		}
	};

	// const handleSubmitDebounce = useDebouncedCallback(async () => {
	// 	if (form.isValid()) {
	// 		setTimeout(async () => {
	// 			await handleSubmit(true);
	// 		}, 1000);
	// 	} else {
	// 		form.validate();
	// 	}
	// }, 1000);

	// useEffect(() => {
	// 	if (form.isDirty()) {
	// 		handleSubmitDebounce();
	// 	}
	// }, [form.values]);

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
				<GridCol span={12}>
					<Group justify="end">
						<Button
							type="submit"
							loading={submitted}
							disabled={drafted}
							leftSection={<IconSend size={16} stroke={1.5} />}
						>
							{submitted ? "Publishing" : "Publish"}
						</Button>
					</Group>
				</GridCol>

				<Transition mounted={warning} transition="fade" duration={250} timingFunction="ease">
					{styles => (
						<div style={{ ...styles, width: "100%" }}>
							<GridCol span={12}>
								<Alert
									variant="light"
									color="yellow"
									title="Save as Draft"
									icon={<IconAlertTriangle size={16} stroke={1.5} />}
									withCloseButton
									onClose={() => setWarning(false)}
									styles={{
										message: {
											paddingRight: "var(--mantine-spacing-xl)",
										},
									}}
								>
									To avoid losing your changes, first save the post as a draft then continue working
									on the content in the edit posts section.
								</Alert>
							</GridCol>
						</div>
					)}
				</Transition>

				<GridCol span={{ base: 12, md: 8 }}>
					<Grid gutter={0}>
						<GridCol span={12}>
							<TextInput
								required
								placeholder={"Title"}
								{...form.getInputProps("title")}
								styles={{
									input: {
										borderColor: "transparent",
										backgroundColor: "transparent",
										fontSize: "var(--mantine-font-size-lg)",
									},
								}}
							/>
						</GridCol>

						<GridCol span={12}>
							<InputContentBlog
								hoistChange={handleContentChange}
								initialValue={postContent}
								error={form.errors.content}
							/>
						</GridCol>

						<Transition
							mounted={form.values.content.trim().length > 7 && info}
							transition="fade"
							duration={250}
							timingFunction="ease"
						>
							{styles => (
								<div style={{ ...styles, width: "100%" }}>
									<GridCol span={12}>
										<Alert
											variant="light"
											color="blue"
											title="Quick Formatting"
											icon={<IconInfoCircle size={16} stroke={1.5} />}
											withCloseButton
											onClose={() => setInfo(false)}
											styles={{
												message: {
													paddingRight: "var(--mantine-spacing-xl)",
												},
											}}
											mt={"xl"}
										>
											To access quick formatting options, highlight the text you&apos;d like to
											style and a toolbar will appear.
										</Alert>
									</GridCol>
								</div>
							)}
						</Transition>
					</Grid>
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<Stack pos={"sticky"} top={`calc(${values.headerHeight}px + var(--mantine-spacing-lg))`}>
						<Group grow>
							<Button
								variant="light"
								type="reset"
								onClick={handleReset}
								disabled={drafted || submitted}
								leftSection={<IconX size={16} stroke={1.5} />}
							>
								Cancel
							</Button>

							{!view ? (
								<Button
									type={"submit"}
									variant="outline"
									disabled={drafted || submitted}
									leftSection={drafted ? <Loader size={16} /> : <IconNotes size={16} stroke={1.5} />}
									onClick={() => handleSubmit(true)}
								>
									{drafted ? "Saving Draft" : "Save Draft"}
								</Button>
							) : (
								<Button
									variant="outline"
									color="green"
									leftSection={<IconArrowUpRight size={16} stroke={1.5} />}
									// onClick={() => handleSubmit(true)}
								>
									View Draft
								</Button>
							)}
						</Group>

						<Fieldset legend="Properties">
							<Grid>
								<GridCol span={12}>
									<Switch
										size="xs"
										label="Allow commenting"
										description="Readers will leave comments"
										key={form.key("comments")}
										{...form.getInputProps("comments")}
										checked={form.values.comments}
									/>
								</GridCol>
								<GridCol span={12}>
									<Switch
										size="xs"
										label="Post as anonymous"
										description="Author won't be required"
										key={form.key("anonymous")}
										{...form.getInputProps("anonymous")}
										checked={form.values.anonymous}
									/>
								</GridCol>
								{!form.values.anonymous && (
									<GridCol span={12}>
										<InputSearchUser
											placeholder={"Post Author"}
											hoistChange={handleUserChange}
											{...form.getInputProps("userId")}
											required
											initialValue={userId}
											autoComplete="off"
										/>
									</GridCol>
								)}
							</Grid>
						</Fieldset>

						<Fieldset legend="Media">
							<DropzonePost />
						</Fieldset>

						<Fieldset legend="Grouping">
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
			</Grid>
		</Box>
	);
}
