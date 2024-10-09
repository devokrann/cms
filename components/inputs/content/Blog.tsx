"use client";

import React, { useEffect, useState } from "react";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { BubbleMenu, useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import values from "@/data/values";
import { Box, Divider, Stack, Switch, Text, Transition } from "@mantine/core";

export default function Blog({ hoistChange, initialValue, error }: any) {
	// const [mounted, setMounted] = useState(false);
	const [content, setContent] = useState<string>(initialValue);
	const [toolbar, setToolbar] = useState(false);

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
		onUpdate: ({ editor }) => {
			// if (initialValue == "clear") {
			// 	setContent("");
			// 	console.log("clear");
			// }

			const html = editor.getHTML(); // Get the HTML content
			setContent(html); // Update the content state
			hoistChange(html); // lift the state

			if (html.length < 8) {
				setToolbar(false);
			}
		},

		// This avoids hydration mismatch by delaying initial render.
		immediatelyRender: false,
	});

	// // Render null during SSR and only load Tiptap after mounting.
	// if (!mounted || !editor) {
	// 	return null;
	// }

	// // Avoid running Tiptap during SSR
	// useEffect(() => {
	// 	setMounted(true);
	// }, []);

	useEffect(() => {
		if (initialValue == "clear") {
			setContent("");
			editor?.commands.clearContent();
		}

		if (initialValue.length < 8) {
			setToolbar(false);
		}
	}, [initialValue]);

	return (
		<RichTextEditor
			editor={editor}
			styles={{
				root: { borderColor: "transparent" },
				toolbar: {
					padding: "var(--mantine-spacing-sm)",
					borderRadius: "var(--mantine-radius-sm)",
					border: "1px solid var(--mantine-color-default-border)",
				},
				content: {
					color: error ? "red" : undefined,
					padding: "var(--mantine-spacing-sm)",
					fontSize: "var(--mantine-font-size-sm)",
				},
			}}
		>
			<BubbleMenu editor={editor}>
				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Bold />
					<RichTextEditor.Italic />
					<RichTextEditor.Underline />
					<RichTextEditor.Strikethrough />
				</RichTextEditor.ControlsGroup>
			</BubbleMenu>

			{content.trim().length > 7 && toolbar && (
				<RichTextEditor.Toolbar sticky stickyOffset={values.headerHeight - 1}>
					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Bold />
						<RichTextEditor.Italic />
						<RichTextEditor.Underline />
						<RichTextEditor.Strikethrough />
					</RichTextEditor.ControlsGroup>

					{/* <RichTextEditor.ControlsGroup>
					<RichTextEditor.Highlight />
					<RichTextEditor.Code />
					<RichTextEditor.ClearFormatting />
				</RichTextEditor.ControlsGroup> */}

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.AlignLeft />
						<RichTextEditor.AlignCenter />
						<RichTextEditor.AlignRight />
						<RichTextEditor.AlignJustify />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.BulletList />
						<RichTextEditor.OrderedList />
					</RichTextEditor.ControlsGroup>

					{/* <RichTextEditor.ControlsGroup>
					<RichTextEditor.Subscript />
					<RichTextEditor.Superscript />
				</RichTextEditor.ControlsGroup> */}

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Blockquote />
						<RichTextEditor.Hr />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Link />
						<RichTextEditor.Unlink />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						{/* <RichTextEditor.H1 /> */}
						<RichTextEditor.H2 />
						<RichTextEditor.H3 />
						<RichTextEditor.H4 />
						<RichTextEditor.H5 />
						<RichTextEditor.H6 />
					</RichTextEditor.ControlsGroup>

					<RichTextEditor.ControlsGroup>
						<RichTextEditor.Undo />
						<RichTextEditor.Redo />
					</RichTextEditor.ControlsGroup>
				</RichTextEditor.Toolbar>
			)}

			<RichTextEditor.Content />

			<Transition
				mounted={!error && content.trim().length > 7}
				transition="fade"
				duration={250}
				timingFunction="ease"
			>
				{styles => (
					<div style={styles}>
						<Stack gap={"sm"} px={"sm"}>
							<Divider />

							<Switch
								checked={toolbar}
								onChange={event => setToolbar(event.currentTarget.checked)}
								label={"Show editior toolbar"}
								size="xs"
							/>
						</Stack>
					</div>
				)}
			</Transition>

			{error && (
				<RichTextEditor.ControlsGroup w={"100%"}>
					<Text
						component="span"
						fz={"xs"}
						c={"light-dark(var(--mantine-color-red-6),var(--mantine-color-red-8))"}
					>
						{error}
					</Text>
				</RichTextEditor.ControlsGroup>
			)}
		</RichTextEditor>
	);
}
