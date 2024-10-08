"use client";

import React from "react";

import {
	ActionIcon,
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
	const { sort, titleOrder, categoryOrder, authorOrder, createdOrder } = useSortBlog(setPosts);

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

				<TableTd w={tableWidths.category}>
					<Badge color={"gray"} variant="light" size="xs">
						{post.category?.title}
					</Badge>
				</TableTd>

				<TableTd w={tableWidths.author}>
					<Text component="span" inherit lineClamp={1}>
						{post.user.name}
					</Text>
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
										checked={posts?.length != 0 && selectedRows.length == posts?.length}
										onChange={event =>
											setSelectedRows(event.currentTarget.checked ? posts?.map(p => p.id)! : [])
										}
									/>
								)}
							</Center>
						</TableTh>

						<TableTh>
							<Group gap={"xs"}>
								<Text component="span" inherit>
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
								<Text component="span" inherit>
									Category
								</Text>

								{!posts ? (
									<Skeleton h={16} w={16} />
								) : (
									<ActionIconSort
										order={categoryOrder}
										sortFunction={() => sort(enumTablePosts.CATEGORY)}
									/>
								)}
							</Group>
						</TableTh>

						<TableTh>
							<Group gap={"xs"}>
								<Text component="span" inherit>
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
								<Text component="span" inherit>
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
					{!posts
						? Array(15)
								.fill(0)
								.map((_, index) => skeletonRow)
						: posts.length > 0
						? rows
						: emptyRow}
				</TableTbody>
			</Table>
		</Stack>
	);
}

const tableWidths = {
	check: { md: "5%", lg: "5%" },
	title: { md: "30%", lg: "30%" },
	category: { md: "20%", lg: "20%" },
	author: { md: "20%", lg: "20%" },
	created: { md: "20%", lg: "20%" },
	delete: { md: "5%", lg: "5%" },
};

const skeletonRow = (
	<TableTr>
		<TableTd>
			<Center>
				<Skeleton h={16} w={16} my={4} />
			</Center>
		</TableTd>
		<TableTd>
			<Skeleton h={12} w={"80%"} my={4} />
		</TableTd>
		<TableTd>
			<Skeleton h={12} w={"50%"} my={4} />
		</TableTd>
		<TableTd>
			<Skeleton h={12} w={"80%"} my={4} />
		</TableTd>
		<TableTd>
			<Skeleton h={12} w={{ lg: "50%" }} my={4} />
		</TableTd>
		<TableTd>
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
