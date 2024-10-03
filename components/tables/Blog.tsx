"use client";

import React, { useEffect, useState } from "react";

import {
	ActionIcon,
	Badge,
	Button,
	Card,
	Center,
	Checkbox,
	Divider,
	Group,
	NumberFormatter,
	Pagination,
	Select,
	Skeleton,
	Stack,
	Table,
	TableCaption,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
	Tooltip,
} from "@mantine/core";

import { IconChevronDown, IconChevronUp, IconSelector, IconTrash } from "@tabler/icons-react";

import InputSearchBlog from "@/components/inputs/search/Blog";

import classes from "./Blog.module.scss";

import { getPosts, removePosts } from "@/handlers/database/posts";
import { enumSort } from "@/types/enums";
import { parseDateYmd } from "@/handlers/parsers/date";
import { PostRelations } from "@/types/model/post";

import ModalsPostDelete from "../modals/post/Delete";

interface typeSortObject {
	order: enumSort;
	button: React.ReactNode;
}

enum enumTablePosts {
	TITLE = "TITLE",
	CATEGORY = "CATEGORY",
	AUTHOR = "AUTHOR",
	CREATED = "CREATED",
}

export default function Blog() {
	const [posts, setPosts] = useState<PostRelations[] | null>(null);

	useEffect(() => {
		const fetchPosts = async () => {
			const result = await getPosts();
			setPosts(result);
		};

		fetchPosts();
	}, []);

	// paginate logic
	const [activePage, setPage] = useState(1);
	const [items, setItems] = useState<PostRelations[]>([]);

	const divisors = [5, 10, 15, 20, 25];
	const [divisor, setDivisor] = useState<string | null>(divisors[0].toString());
	const divisorOptions = divisors.map(o => {
		return { value: o.toString(), label: `Show ${o}` };
	});

	useEffect(() => {
		if (posts) {
			const chunkedPosts = chunkPosts(posts!, Number(divisor));

			if (chunkedPosts[activePage - 1]) {
				setItems(chunkedPosts[activePage - 1].map(item => item));
			} else {
				if (activePage > 1) {
					setPage(activePage - 1);
				} else {
					setItems([]);
				}
			}
		}
	}, [posts, activePage, divisor]);

	// sorting logic
	const getSortButtons = (field: enumTablePosts) => {
		return {
			ascending: (
				<ActionIcon size={16} variant="light" onClick={() => sortItems(field)}>
					<IconChevronUp size={16} stroke={1.5} />
				</ActionIcon>
			),
			descending: (
				<ActionIcon size={16} variant="light" onClick={() => sortItems(field)}>
					<IconChevronDown size={16} stroke={1.5} />
				</ActionIcon>
			),
			default: (
				<ActionIcon size={16} variant="light" onClick={() => sortItems(field)}>
					<IconSelector size={16} stroke={1.5} />
				</ActionIcon>
			),
		};
	};

	const [titleOrder, setTitleOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTablePosts.TITLE).default,
	});
	const [categoryOrder, setCategoryOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTablePosts.CATEGORY).default,
	});
	const [authorOrder, setAuthorOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTablePosts.AUTHOR).default,
	});
	const [createdOrder, setCreatedOrder] = useState<typeSortObject>({
		order: enumSort.DEFAULT,
		button: getSortButtons(enumTablePosts.CREATED).default,
	});

	const sortItems = (field: enumTablePosts) => {
		switch (field) {
			case enumTablePosts.TITLE:
				setTitleOrder(prevTitleOrder => {
					if (prevTitleOrder.order == enumSort.DEFAULT || prevTitleOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'title' ascending
						setPosts(prevPosts => [...prevPosts!].sort((a, b) => a.title.localeCompare(b.title)));

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTablePosts.TITLE).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'title' descending
						setPosts(prevPosts => [...prevPosts!].sort((a, b) => a.title.localeCompare(b.title)).reverse());

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTablePosts.TITLE).descending,
						};
					}
				});
				break;

			case enumTablePosts.CATEGORY:
				setCategoryOrder(prevCategoryOrder => {
					if (prevCategoryOrder.order == enumSort.DEFAULT || prevCategoryOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'category' ascending
						setPosts(prevPosts =>
							[...prevPosts!].sort((a, b) => a.category?.title.localeCompare(b.category?.title!)!)
						);

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTablePosts.CATEGORY).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'category' descending
						setPosts(prevPosts =>
							[...prevPosts!]
								.sort((a, b) => a.category?.title.localeCompare(b.category?.title!)!)
								.reverse()
						);

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTablePosts.CATEGORY).descending,
						};
					}
				});
				break;

			case enumTablePosts.AUTHOR:
				setAuthorOrder(prevAuthorOrder => {
					if (prevAuthorOrder.order == enumSort.DEFAULT || prevAuthorOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'author' ascending
						setPosts(prevPosts =>
							[...prevPosts!].sort((a, b) => a.user.name?.localeCompare(b.user.name!)!)
						);

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTablePosts.AUTHOR).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'author' descending
						setPosts(prevPosts =>
							[...prevPosts!].sort((a, b) => a.user.name?.localeCompare(b.user.name!)!).reverse()
						);

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTablePosts.AUTHOR).descending,
						};
					}
				});
				break;

			case enumTablePosts.CREATED:
				setCreatedOrder(prevCreatedOrder => {
					if (prevCreatedOrder.order == enumSort.DEFAULT || prevCreatedOrder.order == enumSort.DESCENDING) {
						// Create a shallow copy of items and sort by 'created at' ascending
						setPosts(prevPosts =>
							[...prevPosts!].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateA.getTime() - dateB.getTime(); // Sort by time value
							})
						);

						return {
							order: enumSort.ASCENDING,
							button: getSortButtons(enumTablePosts.CREATED).ascending,
						};
					} else {
						// Create a shallow copy of items and sort by 'created at' descending
						setPosts(prevPosts =>
							[...prevPosts!].sort((a, b) => {
								const dateA = new Date(a.createdAt!); // Convert the string to a Date object
								const dateB = new Date(b.createdAt!);
								return dateB.getTime() - dateA.getTime(); // Sort by time value
							})
						);

						return {
							order: enumSort.DESCENDING,
							button: getSortButtons(enumTablePosts.CREATED).descending,
						};
					}
				});
				break;
		}
	};

	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const active = selectedRows.length > 0;

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
				<Skeleton h={16} w={16} my={4} />
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
				<Skeleton h={12} w={"50%"} my={4} />
			</TableTd>
			<TableTd>
				<Skeleton h={24} w={24} my={4} />
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

	const rows = items?.map(post => {
		const key = `${post.title}-${post.user.id}`;

		return (
			<TableTr key={key} bg={selectedRows.includes(key) ? "var(--mantine-color-gray-1)" : undefined}>
				<Table.Td w={tableWidths.check}>
					<Checkbox
						size="xs"
						aria-label="Select row"
						checked={selectedRows.includes(key)}
						onChange={event =>
							setSelectedRows(
								event.currentTarget.checked
									? [...selectedRows, key]
									: selectedRows.filter(position => position !== key)
							)
						}
					/>
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
						<ModalsPostDelete post={post} posts={posts!} setPosts={setPosts}>
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

	const handleDelete = async () => {
		// remove posts from state
		setPosts(
			posts?.filter(p => {
				const key = `${p.title}-${p.user.id}`;
				return !selectedRows.includes(key);
			})!
		);

		// delete posts from database
		await removePosts(
			posts?.filter(p => {
				const key = `${p.title}-${p.user.id}`;
				return selectedRows.includes(key);
			})!
		);

		// reset selection
		setSelectedRows([]);
	};

	return (
		<Stack>
			<Card withBorder shadow="xs" padding={"xs"} style={{ overflow: "unset" }}>
				<Stack>
					<Group justify="space-between">
						{!posts ? (
							<Skeleton h={28} w={240} />
						) : (
							<InputSearchBlog size={"xs"} placeholder={"Search posts..."} />
						)}

						<Group gap={"xs"}>
							{!posts ? (
								<Skeleton h={28} w={120} />
							) : (
								<Select
									size="xs"
									w={120}
									defaultValue={divisorOptions[0].value}
									placeholder={divisorOptions[0].label}
									data={divisorOptions}
									value={divisor}
									onChange={setDivisor}
									allowDeselect={false}
									withCheckIcon={false}
								/>
							)}

							<Divider orientation="vertical" />

							{!posts ? <Skeleton h={28} w={96} /> : <Button size="xs">Clear Filters</Button>}
						</Group>
					</Group>

					<Group>
						{!posts ? (
							<Skeleton h={28} w={96} />
						) : (
							<Button size="xs" disabled={!active} color="red" variant="light" onClick={handleDelete}>
								Delete ({selectedRows.length})
							</Button>
						)}
					</Group>
				</Stack>
			</Card>

			<Card withBorder padding={0} shadow="xs" c={"inherit"}>
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
												setSelectedRows(
													event.currentTarget.checked ? posts?.map(p => p.id)! : []
												)
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
									{titleOrder.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Category
									</Text>
									{categoryOrder.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Author
									</Text>
									{authorOrder.button}
								</Group>
							</TableTh>

							<TableTh>
								<Group gap={"xs"}>
									<Text component="span" inherit>
										Created On
									</Text>
									{createdOrder.button}
								</Group>
							</TableTh>

							<TableTh />
						</TableTr>
					</TableThead>

					<TableTbody>
						{!posts ? [skeletonRow, skeletonRow, skeletonRow] : posts.length > 0 ? rows : emptyRow}
					</TableTbody>

					<TableCaption>
						<Group justify="space-between">
							{!posts ? (
								<Skeleton h={16} w={160} />
							) : (
								<Text component="span" inherit>
									Showing <NumberFormatter thousandSeparator value={rows?.length} /> of{" "}
									<NumberFormatter thousandSeparator value={posts?.length} /> posts
								</Text>
							)}

							{!posts ? (
								<Group gap={"xs"}>
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
									<Skeleton h={24} w={24} />
								</Group>
							) : (
								<Pagination
									size={"sm"}
									total={Math.ceil(posts.length / Number(divisor))}
									value={activePage}
									onChange={setPage}
									defaultValue={1}
								/>
							)}
						</Group>
					</TableCaption>
				</Table>
			</Card>
		</Stack>
	);
}

const chunkPosts = (array: PostRelations[], size: number): PostRelations[][] => {
	if (!array.length) {
		return [];
	}

	const head = array.slice(0, size);
	const tail = array.slice(size);

	return [head, ...chunkPosts(tail, size)];
};
