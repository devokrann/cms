import { StatusUser } from "@prisma/client";
import { UserGet } from "@/types/model/user";
import { Badge } from "@mantine/core";
import React from "react";

export default function UserStatus({ user }: { user: UserGet }) {
	return (
		<Badge size="xs" variant="light" color={getStatusColor(user.status as StatusUser)}>
			{user.status}
		</Badge>
	);
}

const getStatusColor = (status: StatusUser) => {
	switch (status) {
		case StatusUser.ACTIVE:
			return "green";
		case StatusUser.INACTIVE:
			return "yellow";
	}
};
