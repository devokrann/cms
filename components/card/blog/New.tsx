import React from "react";

import Link from "next/link";
import NextImage from "next/image";

import {
	Anchor,
	Badge,
	Box,
	Card,
	Divider,
	Grid,
	GridCol,
	Group,
	Image,
	Skeleton,
	Stack,
	Text,
	Title,
} from "@mantine/core";

import classes from "./New.module.scss";

import { typePost } from "@/types/post";
import { linkify } from "@/handlers/parsers/string";

export default function New({ data }: { data: typePost }) {
	return (
		<Card className={classes.card} withBorder>
			<Grid align="center" gutter={0}>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Anchor component={Link} underline="hover" inherit href={`/blog/${linkify(data.titleLink)}`}>
						<Skeleton h={{ base: 240, sm: 360 }} radius={0} />
					</Anchor>
				</GridCol>
				<GridCol span={{ base: 12, sm: 6 }}>
					<Stack gap={"lg"} px={{ base: "lg", sm: "xl" }} py={{ base: "lg", md: 32 }}>
						<Stack>
							<Title order={3} fz={{ md: 28, lg: 36 }} lh={{ md: 1 }} className={classes.title}>
								<Anchor
									component={Link}
									underline="hover"
									inherit
									href={`/blog/${linkify(data.titleLink)}`}
								>
									{data.title}
								</Anchor>
							</Title>
							<Text className={classes.desc} c={"dark.3"}>
								{data.desc}
							</Text>
						</Stack>

						<Divider />

						<Group justify="space-between">
							<Badge variant="light" radius={"sm"} tt={"capitalize"}>
								{data.category}
							</Badge>
							<Text fz={"xs"} inherit c={"pri"}>
								{data.date}
							</Text>
						</Group>
					</Stack>
				</GridCol>
			</Grid>
		</Card>
	);
}
