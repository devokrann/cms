import React from "react";

import { Metadata } from "next";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

export const metadata: Metadata = { title: "About" };

export default async function About() {
	return (
		<LayoutPage>
			<LayoutSection padded containerized={"responsive"}>
				About page
			</LayoutSection>
		</LayoutPage>
	);
}
