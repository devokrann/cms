import { Group, Stack, Text, Image } from "@mantine/core";

import NextImage from "next/image";
import {
	Dropzone,
	DropzoneAccept,
	DropzoneIdle,
	DropzoneProps,
	DropzoneReject,
	IMAGE_MIME_TYPE,
} from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { uploadFile } from "@/handlers/upload";

export default function User(props: Partial<DropzoneProps>) {
	const [files, setFiles] = useState<File[]>([]);
	const [loading, setLoading] = useState(false);

	return (
		<Dropzone
			loading={loading}
			onDrop={async files => {
				try {
					console.log(files[0]);

					setLoading(true);

					const result = await uploadFile(files[0]);

					// console.log("result", result);

					notifications.show({
						id: `upload-success-${files[0].name}-invalid`,
						icon: <IconCheck size={16} stroke={1.5} />,
						title: "File Uploaded",
						message: "The file has been uploaded",
						variant: "success",
					});
				} catch (error) {
					notifications.show({
						id: `upload-failed-${files[0].name}`,
						icon: <IconX size={16} stroke={1.5} />,
						title: "Unexpected Error",
						message: "An unexpected error has occured",
						variant: "failed",
					});
				} finally {
					setLoading(false);
				}
			}}
			onReject={async files => {
				console.log("rejected files", files);

				if (files[0].errors[0].code == "file-invalid-type") {
					notifications.show({
						id: `upload-failed-${files[0].file.name}-invalid`,
						icon: <IconX size={16} stroke={1.5} />,
						title: "Invalid File Type",
						message: "That file type is not supported",
						variant: "failed",
					});
				} else if (files[0].errors[0].code == "file-too-large") {
					notifications.show({
						id: `upload-failed-${files[0].file.name}-too-large`,
						icon: <IconX size={16} stroke={1.5} />,
						title: "File Too Large",
						message: "Limit file size to 5 MB",
						variant: "failed",
					});
				}
			}}
			maxSize={5 * 1024 ** 2}
			accept={IMAGE_MIME_TYPE}
			multiple={false}
			{...props}
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

				{files.length > 0 ? (
					<Group>
						<Image
							src={`/images/uploads/posts/${files[0].name}`}
							alt={files[0].name}
							h={{ base: 24 }}
							component={NextImage}
							width={1920}
							height={1080}
							priority
						/>
					</Group>
				) : (
					<Stack gap={"xs"}>
						<Text size="sm" ta={"center"}>
							Drag image here or click to select files
						</Text>
						<Text size="xs" c="dimmed" ta={"center"}>
							Attach a single file, the file should not exceed 5 mb
						</Text>
					</Stack>
				)}
			</Group>
		</Dropzone>
	);
}
