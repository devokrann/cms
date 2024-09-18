import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";

import { typeParams } from "../layout";

export default function Post({ params }: { params: typeParams }) {
	return (
		<LayoutPage>
			<LayoutSection padded>Blog {params.blogId}</LayoutSection>
		</LayoutPage>
	);
}
