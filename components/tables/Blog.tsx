"use client";

import React from "react";

import {
	ActionIcon,
	Anchor,
	Avatar,
	Badge,
	Center,
	Checkbox,
	Group,
	Skeleton,
	Stack,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
	Tooltip,
} from "@mantine/core";

import { IconTrash } from "@tabler/icons-react";

import classes from "./Blog.module.scss";

import { parseDateYmd } from "@/handlers/parsers/date";
import { PostRelations } from "@/types/model/post";
import ActionIconSort from "../action-icon/Sort";
import ModalsPostDelete from "../modals/post/Delete";
import { useSortBlog } from "@/hooks/sort";
import { enumTablePosts } from "@/types/enums";
import { initialize } from "@/handlers/parsers/string";
import Link from "next/link";
import BadgeStatusPost from "../badges/status/Post";

export default function Blog({
	posts,
	setPosts,
	items,
	setItems,
	selectedRows,
	setSelectedRows,
}: {
	posts: PostRelations[] | null;
	setPosts: any;
	items: PostRelations[];
	setItems: any;
	selectedRows: string[];
	setSelectedRows: any;
}) {
	const { sort, titleOrder, categoryOrder, statusOrder, authorOrder, createdOrder } = useSortBlog(setPosts);

	const rows = items?.map(post => {
		return (
			<TableTr
				key={post.id}
				bg={
					selectedRows.includes(post.id)
						? "light-dark(var(--mantine-color-gray-1),var(--mantine-color-gray-light))"
						: undefined
				}
			>
				<Table.Td w={tableWidths.check}>
					<Center>
						<Checkbox
							size="xs"
							aria-label="Select row"
							checked={selectedRows.includes(post.id)}
							onChange={event =>
								setSelectedRows(
									event.currentTarget.checked
										? [...selectedRows, post.id]
										: selectedRows.filter(position => position !== post.id)
								)
							}
						/>
					</Center>
				</Table.Td>

				<TableTd w={tableWidths.title}>
					<Text component="span" inherit lineClamp={1}>
						{post.title}
					</Text>
				</TableTd>

				<TableTd w={tableWidths.author}>
					<Group gap={"xs"} wrap="nowrap">
						{!post.user ? (
							<Anchor inherit>
								<Avatar>A</Avatar>
							</Anchor>
						) : !post.user.image ? (
							<Anchor inherit component={Link} href={`/listings/users/${post.user.id}`} underline="never">
								<Avatar>{initialize(post.user.name!)}</Avatar>
							</Anchor>
						) : (
							<Anchor inherit component={Link} href={`/listings/users/${post.user.id}`} underline="never">
								<Avatar src={post.user.image} alt={post.user.name!} />
							</Anchor>
						)}

						{!post.user ? (
							<Tooltip label={"Anonymous"} withArrow position="top-start" fz={"xs"}>
								<Text component="span" inherit lineClamp={1}>
									Anonymous
								</Text>
							</Tooltip>
						) : (
							<Tooltip label={post.user.name} withArrow position="top-start" fz={"xs"}>
								<Text component="span" inherit lineClamp={1}>
									{post.user.name}
								</Text>
							</Tooltip>
						)}
					</Group>
				</TableTd>

				<TableTd w={tableWidths.status}>
					<BadgeStatusPost post={post} />
				</TableTd>

				<TableTd w={tableWidths.created}>{parseDateYmd(post.createdAt!)}</TableTd>

				<TableTd w={tableWidths.delete}>
					<Center>
						<ModalsPostDelete
							selection={post}
							posts={posts!}
							setPosts={setPosts}
							setSelectedRows={setSelectedRows}
						>
							<Tooltip withArrow label="Delete post">
								<ActionIcon color="red" variant="light">
									<IconTrash size={16} stroke={1.5} />
								</ActionIcon>
							</Tooltip>
						</ModalsPostDelete>
					</Center>
				</TableTd>
			</TableTr>
		);
	});

	return (
		<Stack>
			<Table verticalSpacing={"sm"} classNames={{ thead: classes.thead, caption: classes.caption }}>
				<TableThead tt={"uppercase"} fz={"xs"}>
					<TableTr>
						<TableTh w={tableWidths.check}>
							<Center>
								{!posts ? (
									<Skeleton h={16} w={16} />
								) : (
									<Checkbox
										size="xs"
										aria-label="Select row"
										checked={items.length > 0 && selectedRows.length == items.length}
										indeterminate={selectedRows.length > 0 && selectedRows.length != items.length}
										onChange={event =>
											setSelectedRows(event.currentTarget.checked ? items?.map(p => p.id)! : [])
										}
									/>
								)}
							</Center>
						</TableTh>

						<TableTh>
							<Group gap={"xs"}>
								<Text component="span" inherit fw={500}>
									Title
								</Text>

								{!posts ? (
									<Skeleton h={16} w={16} />
								) : (
									<ActionIconSort
										order={titleOrder}
										sortFunction={() => sort(enumTablePosts.TITLE)}
									/>
								)}
							</Group>
						</TableTh>

						<TableTh>
							<Group gap={"xs"}>
								<Text component="span" inherit fw={500}>
									Author
								</Text>

								{!posts ? (
									<Skeleton h={16} w={16} />
								) : (
									<ActionIconSort
										order={authorOrder}
										sortFunction={() => sort(enumTablePosts.AUTHOR)}
									/>
								)}
							</Group>
						</TableTh>

						<TableTh>
							<Group gap={"xs"}>
								<Text component="span" inherit fw={500}>
									Status
								</Text>

								{!posts ? (
									<Skeleton h={16} w={16} />
								) : (
									<ActionIconSort
										order={statusOrder}
										sortFunction={() => sort(enumTablePosts.STATUS)}
									/>
								)}
							</Group>
						</TableTh>

						<TableTh>
							<Group gap={"xs"}>
								<Text component="span" inherit fw={500}>
									Created On
								</Text>

								{!posts ? (
									<Skeleton h={16} w={16} />
								) : (
									<ActionIconSort
										order={createdOrder}
										sortFunction={() => sort(enumTablePosts.CREATED)}
									/>
								)}
							</Group>
						</TableTh>

						<TableTh />
					</TableTr>
				</TableThead>

				<TableTbody>
					{!posts ? (
						Array(15)
							.fill(0)
							.map((_, index) => skeletonRow)
					) : items.length > 0 ? (
						<>
							{/* {skeletonRow} */}
							{rows}
						</>
					) : (
						emptyRow
					)}
				</TableTbody>
			</Table>
		</Stack>
	);
}

const tableWidths = {
	check: { md: "5%", lg: "5%" },
	title: { md: "30%", lg: "30%" },
	status: { md: "15%", lg: "15%" },
	author: { md: "25%", lg: "25%" },
	created: { md: "20%", lg: "20%" },
	delete: { md: "5%", lg: "5%" },
};

const skeletonRow = (
	<TableTr>
		<TableTd w={tableWidths.check}>
			<Center>
				<Skeleton h={16} w={16} my={4} />
			</Center>
		</TableTd>
		<TableTd w={tableWidths.title}>
			<Skeleton h={12} w={"80%"} my={4} />
		</TableTd>
		<TableTd w={tableWidths.author}>
			<Group gap={"xs"}>
				<Skeleton h={38} w={38} radius={"xl"} />
				<Skeleton h={12} w={"50%"} />
			</Group>
		</TableTd>
		<TableTd w={tableWidths.status}>
			<Skeleton h={12} w={"80%"} my={4} />
		</TableTd>
		<TableTd w={tableWidths.created}>
			<Skeleton h={12} w={{ lg: "50%" }} my={4} />
		</TableTd>
		<TableTd w={tableWidths.delete}>
			<Center>
				<Skeleton h={24} w={24} my={4} />
			</Center>
		</TableTd>
	</TableTr>
);

const emptyRow = (
	<TableTr>
		<TableTd colSpan={10}>
			<Group justify="center" my={"xl"}>
				<Text component="span" inherit ta={"center"}>
					No Posts Found
				</Text>
			</Group>
		</TableTd>
	</TableTr>
);
