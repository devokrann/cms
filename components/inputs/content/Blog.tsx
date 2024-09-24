"use client";

import React, { useEffect, useState } from "react";

import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

export default function Blog({ hoistChange, initialValue }: any) {
	// const [mounted, setMounted] = useState(false);
	const [content, setContent] = useState<string>(initialValue);

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
	}, [initialValue]);

	return (
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
	);
}
