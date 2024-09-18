import React from "react";

import LayoutSection from "../Section";

import PartialHeroRoute from "@/partials/heros/Route";

export default function Main() {
	return (
		<LayoutSection containerized="responsive" mb={"xl"}>
			<PartialHeroRoute />
		</LayoutSection>
	);
}
