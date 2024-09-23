import { Group, Stack, Text } from "@mantine/core";
import { Dropzone, DropzoneAccept, DropzoneIdle, DropzoneReject, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React from "react";

export default function User() {
	return (
		<Dropzone
			onDrop={files => console.log("accepted files", files)}
			onReject={files => console.log("rejected files", files)}
			// maxSize={5 * 1024 ** 2}
			accept={IMAGE_MIME_TYPE}
			// {...props}
		>
			<Group justify="center" style={{ pointerEvents: "none" }}>
				<DropzoneAccept>
					<IconUpload size={24} color={"var(--mantine-color-blue-6)"} stroke={1.5} />
				</DropzoneAccept>

				<DropzoneReject>
					<IconX size={24} color={"var(--mantine-color-red-6)"} stroke={1.5} />
				</DropzoneReject>

				<DropzoneIdle>
					<IconPhoto size={24} color={"var(--mantine-color-dimmed)"} stroke={1.5} />
				</DropzoneIdle>

				<Stack gap={"xs"}>
					<Text size="sm" ta={"center"}>
						Drag image here or click to select files
					</Text>
					<Text size="xs" c="dimmed" ta={"center"}>
						Attach as many files as you like, each file should not exceed 5mb
					</Text>
				</Stack>
			</Group>
		</Dropzone>
	);
}
