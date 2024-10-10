import { StatusPost, StatusUser } from "@prisma/client";
import { Badge } from "@mantine/core";
import React from "react";
import { PostGet } from "@/types/model/post";

export default function Post({ post }: { post: PostGet }) {
	return (
		<Badge size="xs" variant="light" color={getStatusColor(post.status as StatusPost)}>
			{post.status}
		</Badge>
	);
}

const getStatusColor = (status: StatusPost) => {
	switch (status) {
		case StatusPost.DRAFT:
			return "blue";
		case StatusPost.INACTIVE:
			return "yellow";
		case StatusPost.PUBLISHED:
			return "green";
	}
};
