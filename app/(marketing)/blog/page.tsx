import React from "react";

import { Box, Divider, Grid, GridCol, Stack, Text, Title } from "@mantine/core";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import CardBlogNew from "@/components/card/blog/New";
import CardBlogMain from "@/components/card/blog/Main";

import posts from "@/data/blog";

export default function Blog() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				<Stack gap={"xl"}>
					<Stack align="center">
						<Title order={2} ta={"center"}>
							Expert web design advice
						</Title>
						<Text ta={"center"} w={{ md: "50%", lg: "40%" }}>
							Lorem ipsum dolor sit amet consectetur adipiscing eli mattis sit phasellus mollis sit
							aliquam sit nullam.
						</Text>
					</Stack>

					<Box w={{ md: "80%" }} mx={"auto"}>
						<CardBlogNew data={posts[0]} />
					</Box>
				</Stack>
			</LayoutSection>

			<LayoutSection containerized={"responsive"}>
				<Divider />
			</LayoutSection>

			<LayoutSection padded containerized={"responsive"}>
				<Grid gutter={"xl"}>
					{posts.map(
						post =>
							posts.indexOf(post) != 0 && (
								<GridCol key={post.title} span={{ base: 12, sm: 6, md: 4 }}>
									<CardBlogMain data={post} />
								</GridCol>
							)
					)}
				</Grid>
			</LayoutSection>
		</LayoutPage>
	);
}
