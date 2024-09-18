import React from "react";

import LayoutSection from "../Section";

import PartialHeroRoute from "@/partials/heros/Route";

export default function Route() {
	return (
		<LayoutSection containerized="responsive">
			<PartialHeroRoute />
		</LayoutSection>
	);
}
