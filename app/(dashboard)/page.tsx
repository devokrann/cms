import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Overview" };

export default function Overview() {
	return (
		<LayoutPage>
			<LayoutSection padded="md">
				<p>Overview</p>
			</LayoutSection>
		</LayoutPage>
	);
}
