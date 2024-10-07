import { enumSort } from "@/types/enums";
import { ActionIcon } from "@mantine/core";
import { IconChevronDown, IconChevronUp, IconSelector } from "@tabler/icons-react";
import React from "react";

export default function Sort({ order, sortFunction }: { order: enumSort; sortFunction: any }) {
	switch (order) {
		case enumSort.ASCENDING:
			return (
				<ActionIcon size={16} variant="light" onClick={sortFunction}>
					<IconChevronUp size={16} stroke={1.5} />
				</ActionIcon>
			);
		case enumSort.DESCENDING:
			return (
				<ActionIcon size={16} variant="light" onClick={sortFunction}>
					<IconChevronDown size={16} stroke={1.5} />
				</ActionIcon>
			);
		case enumSort.DEFAULT:
			return (
				<ActionIcon size={16} variant="light" onClick={sortFunction}>
					<IconSelector size={16} stroke={1.5} />
				</ActionIcon>
			);
	}
}
