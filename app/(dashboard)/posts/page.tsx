"use client";

import React, { useEffect, useState } from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Button, Card, Divider, Group, NumberFormatter, Skeleton, Stack, Text, Title } from "@mantine/core";
import TableBlog from "@/components/tables/Blog";
import { IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import Link from "next/link";
import SelectDivisor from "@/components/select/Divisor";
import { PostRelations } from "@/types/model/post";
import { getPosts } from "@/handlers/database/posts";
import { usePaginate } from "@/hooks/paginate";
import PaginationTable from "@/components/pagination/Table";
import ModalPostDelete from "@/components/modals/post/Delete";
import FormFilterBlog from "@/partials/forms/filter/Blog";

export default function Posts() {
	const [posts, setPosts] = useState<PostRelations[] | null>(null);
	const [filteredPosts, setFilteredPosts] = useState<PostRelations[] | null>(null);

	useEffect(() => {
		const fetchPosts = async () => {
			const result = await getPosts();

			setPosts(result);
			setFilteredPosts(result);
		};

		fetchPosts();
	}, []);

	// paginate logic
	const divisors = [5, 10, 15, 20, 25];
	const [divisor, setDivisor] = useState<string | null>(divisors[0].toString());
	const { activePage, setActivePage, items, setItems, pageRange } = usePaginate(filteredPosts!, divisor!);

	// table logic
	const [selectedRows, setSelectedRows] = useState<string[]>([]);

	useEffect(() => {
		setSelectedRows(selectedRows.filter(i => items?.find(u => u.id == i)));
	}, [items]);

	return (
		<LayoutPage stacked="xl">
			<LayoutSection>
				<Group justify="space-between" align="end">
					<Title order={1} fz={"xl"}>
						Posts
					</Title>

					<Button
						leftSection={<IconPlus size={16} stroke={1.5} />}
						component={Link}
						href={"/posts/create"}
						size="xs"
					>
						New Post
					</Button>
				</Group>
			</LayoutSection>

			<LayoutSection>
				<Stack>
					<Card withBorder shadow="xs" padding={"xs"}>
						<Stack>
							<FormFilterBlog
								posts={posts}
								setFilteredPosts={setFilteredPosts}
								setSelectedRows={setSelectedRows}
							/>

							<Divider />

							<Group justify="space-between">
								<Group>
									{!posts ? (
										<Skeleton h={28} w={96} />
									) : (
										<Button
											size="xs"
											disabled={selectedRows.length < 1}
											color="red"
											variant="light"
											leftSection={<IconX size={16} stroke={1} />}
											onClick={() => setSelectedRows([])}
										>
											Clear Selection ({selectedRows.length})
										</Button>
									)}

									{!posts ? (
										<Skeleton h={28} w={96} />
									) : (
										<ModalPostDelete
											selections={items.filter(i => selectedRows.includes(i.id))}
											posts={posts!}
											setPosts={setPosts}
											setSelectedRows={setSelectedRows}
										>
											<Button
												size="xs"
												disabled={selectedRows.length < 1}
												color="yellow"
												variant="light"
												leftSection={<IconTrash size={16} stroke={1} />}
											>
												Delete Posts ({selectedRows.length})
											</Button>
										</ModalPostDelete>
									)}
								</Group>

								{!posts ? (
									<Skeleton h={28} w={120} />
								) : (
									<SelectDivisor divisors={divisors} divisor={divisor} setDivisor={setDivisor} />
								)}
							</Group>
						</Stack>
					</Card>

					<Card withBorder shadow="xs" padding={0}>
						<TableBlog
							posts={posts!}
							setPosts={setPosts}
							items={items}
							setItems={setItems}
							selectedRows={selectedRows}
							setSelectedRows={setSelectedRows}
						/>
					</Card>

					<Card withBorder shadow="xs" padding={"xs"}>
						<Group justify="space-between">
							{!posts ? (
								<Skeleton h={16} w={160} />
							) : (
								<Text component="span" inherit fz={"xs"}>
									Showing{" "}
									{filteredPosts?.length! > 0 && (
										<>
											{pageRange?.from} to {pageRange?.to} of
										</>
									)}{" "}
									<NumberFormatter thousandSeparator value={filteredPosts?.length} /> posts
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
								<PaginationTable
									list={filteredPosts!}
									divisor={divisor!}
									activePage={activePage}
									setActivePage={setActivePage}
								/>
							)}
						</Group>
					</Card>
				</Stack>
			</LayoutSection>
		</LayoutPage>
	);
}
