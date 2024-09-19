"use client";

import React, { useEffect, useState } from "react";

import {
	Box,
	Button,
	Card,
	CardSection,
	Center,
	Divider,
	Fieldset,
	Grid,
	GridCol,
	Group,
	MultiSelect,
	PasswordInput,
	Radio,
	RadioGroup,
	Select,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title,
} from "@mantine/core";

import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { hasLength, useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { IconCheck, IconX, IconUpload, IconPhoto } from "@tabler/icons-react";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

interface typeFormUser {
	title: string;
	content: string;
	published: string;
}

export default function Post() {
	const [submitted, setSubmitted] = useState(false);

	const form = useForm({
		initialValues: {
			title: "",
			content: "",
			published: "",
		},

		validate: {
			title: hasLength({ min: 0, max: 64 }, "Between 2 and 64 characters"),
			content: value => value.trim().length < 1 && "Please fill out this field",
			published: hasLength({ min: 1, max: 24 }, "Please fill out this field"),
		},
	});

	const parse = (rawData: typeFormUser) => {
		return {
			title: rawData.title.trim(),
			content: rawData.content.trim(),
			published: rawData.published,
		};
	};

	const handleSubmit = async () => {
		if (form.isValid()) {
			try {
				setSubmitted(true);

				await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/contact", {
					method: "POST",
					body: JSON.stringify(parse(form.values)),
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}).then(res => {
					if (!res) {
						notifications.show({
							id: "form-user-create-failed-no-response",
							icon: <IconX size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "Server Unavailable",
							message: `There was no response from the server.`,
							variant: "failed",
						});
					} else {
						notifications.show({
							id: "form-user-create-success",
							icon: <IconCheck size={16} stroke={1.5} />,
							autoClose: 5000,
							title: "User Created",
							message: `Post has been added`,
							variant: "success",
						});
					}
				});
			} catch (error) {
				notifications.show({
					id: "form-user-create-failed",
					icon: <IconX size={16} stroke={1.5} />,
					autoClose: 5000,
					title: "Submisstion Failed",
					message: (error as Error).message,
					variant: "failed",
				});
			} finally {
				form.reset();
				setSubmitted(false);
			}
		}
	};

	const [mounted, setMounted] = useState(false);

	// Avoid running Tiptap during SSR
	useEffect(() => {
		setMounted(true);
	}, []);

	// rich text editor
	const content = "";

	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({ placeholder: "Add post content here..." }),
		],
		content,

		// This avoids hydration mismatch by delaying initial render.
		immediatelyRender: false,
	});

	// Render null during SSR and only load Tiptap after mounting.
	if (!mounted || !editor) {
		return null;
	}

	return (
		<Box component="form" onSubmit={form.onSubmit(values => handleSubmit())} noValidate>
			<Grid>
				<GridCol span={{ base: 12, md: 8, lg: 6 }}>
					<TextInput required label={"Title"} placeholder={"Post Title"} {...form.getInputProps("title")} />
				</GridCol>

				<GridCol span={{ base: 12, md: 8 }}>
					<RichTextEditor editor={editor} styles={{ content: { minHeight: "50vh" } }}>
						<RichTextEditor.Toolbar sticky stickyOffset={0}>
							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Bold />
								<RichTextEditor.Italic />
								<RichTextEditor.Underline />
								<RichTextEditor.Strikethrough />
								<RichTextEditor.ClearFormatting />
								<RichTextEditor.Highlight />
								<RichTextEditor.Code />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.H1 />
								<RichTextEditor.H2 />
								<RichTextEditor.H3 />
								<RichTextEditor.H4 />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Blockquote />
								<RichTextEditor.Hr />
								<RichTextEditor.BulletList />
								<RichTextEditor.OrderedList />
								<RichTextEditor.Subscript />
								<RichTextEditor.Superscript />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Link />
								<RichTextEditor.Unlink />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.AlignLeft />
								<RichTextEditor.AlignCenter />
								<RichTextEditor.AlignJustify />
								<RichTextEditor.AlignRight />
							</RichTextEditor.ControlsGroup>

							<RichTextEditor.ControlsGroup>
								<RichTextEditor.Undo />
								<RichTextEditor.Redo />
							</RichTextEditor.ControlsGroup>
						</RichTextEditor.Toolbar>

						<RichTextEditor.Content />
					</RichTextEditor>
				</GridCol>

				<GridCol span={{ base: 12, md: 4 }}>
					<Grid pos={"sticky"} top={"var(--mantine-spacing-lg)"} gutter={0}>
						<GridCol span={12}>
							<Stack>
								<Card withBorder>
									<Stack gap={"xs"}>
										<Title order={2} fz={"sm"}>
											Post Image
										</Title>

										<Dropzone
											onDrop={files => console.log("accepted files", files)}
											onReject={files => console.log("rejected files", files)}
											// maxSize={5 * 1024 ** 2}
											accept={IMAGE_MIME_TYPE}
											// {...props}
										>
											<Group justify="center" style={{ pointerEvents: "none" }}>
												<Dropzone.Accept>
													<IconUpload
														size={24}
														color={"var(--mantine-color-blue-6)"}
														stroke={1.5}
													/>
												</Dropzone.Accept>

												<Dropzone.Reject>
													<IconX
														size={24}
														color={"var(--mantine-color-red-6)"}
														stroke={1.5}
													/>
												</Dropzone.Reject>

												<Dropzone.Idle>
													<IconPhoto
														size={24}
														color={"var(--mantine-color-dimmed)"}
														stroke={1.5}
													/>
												</Dropzone.Idle>

												<Stack gap={"xs"}>
													<Text size="sm" ta={"center"}>
														Drag image here or click to select files
													</Text>
													<Text size="xs" c="dimmed" ta={"center"}>
														Attach as many files as you like, each file should not exceed
														5mb
													</Text>
												</Stack>
											</Group>
										</Dropzone>
									</Stack>
								</Card>

								<Card withBorder c={"inherit"}>
									<Stack>
										<Stack gap={"xs"}>
											<Title order={2} fz={"sm"}>
												Status
											</Title>

											<RadioGroup defaultValue={"enabled"}>
												<Stack>
													<Radio value="enabled" label="Enabled" />
													<Radio value="disabled" label="Disabled" />
												</Stack>
											</RadioGroup>
										</Stack>

										<CardSection>
											<Divider />
										</CardSection>

										<Stack gap={"xs"}>
											<Title order={2} fz={"sm"}>
												Metadata
											</Title>

											<Select
												required
												label={"Category"}
												placeholder={"Post Category"}
												{...form.getInputProps("category")}
												data={["caregory1"]}
											/>

											<MultiSelect
												required
												label="Tags"
												placeholder="Post Tags"
												{...form.getInputProps("tags")}
												data={["tag1", "tag2", "tag3", "tag4"]}
											/>
										</Stack>

										<CardSection>
											<Divider />
										</CardSection>

										<Stack gap={"xs"}>
											<Title order={2} fz={"sm"}>
												Relationships
											</Title>

											<Select
												required
												label={"Author"}
												placeholder={"Post Author"}
												{...form.getInputProps("author")}
												data={["author1"]}
											/>
										</Stack>
									</Stack>
								</Card>
							</Stack>
						</GridCol>
					</Grid>
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
