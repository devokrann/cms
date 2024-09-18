import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import LayoutBody from "@/layouts/Body";
import FooterMain from "@/partials/footers/Main";
import HeaderMain from "@/partials/headers/Main";

export default function Home() {
	return (
		<LayoutBody header={<HeaderMain />} footer={<FooterMain />}>
			<main>
				<LayoutPage>
					<LayoutSection padded containerized={"responsive"}>
						<div>Home Page</div>
					</LayoutSection>
				</LayoutPage>
			</main>
		</LayoutBody>
	);
}
