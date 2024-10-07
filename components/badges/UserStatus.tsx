import { enumUserStatus } from "@/types/enums";
import { UserGet } from "@/types/model/user";
import { Badge } from "@mantine/core";
import React from "react";

export default function UserStatus({ user }: { user: UserGet }) {
	return (
		<Badge size="xs" variant="light" color={getStatusColor(user.status as enumUserStatus)}>
			{user.status}
		</Badge>
	);
}

const getStatusColor = (status: enumUserStatus) => {
	switch (status) {
		case enumUserStatus.ACTIVE:
			return "green";
		case enumUserStatus.INACTIVE:
			return "yellow";
	}
};
