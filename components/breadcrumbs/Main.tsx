import React from "react";

import Link from "next/link";

import { Anchor, Breadcrumbs } from "@mantine/core";

import { IconChevronRight } from "@tabler/icons-react";

import classes from "./Main.module.scss";

import { typeLink } from "@/types/link";

export default function Main({ data }: { data: typeLink[] }) {
	const active = (breadcrumb: typeLink) => data.indexOf(breadcrumb) == data.length - 1;

	return (
		<Breadcrumbs
			separator={
				<IconChevronRight
					size={12}
					stroke={1.5}
					color="light-dark(var(--mantine-color-pri-6),var(--mantine-color-pri-6))"
				/>
			}
		>
			{data.map(item => (
				<Anchor
					key={item.link}
					c={active(item) ? "pri" : undefined}
					className={classes.link}
					component={Link}
					href={item.link}
				>
					{item.label}
				</Anchor>
			))}
		</Breadcrumbs>
	);
}
