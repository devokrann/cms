import React from "react";

import LayoutPage from "@/layouts/Page";
import LayoutSection from "@/layouts/Section";
import LayoutBody from "@/layouts/Body";
import NavbarMain from "@/partials/navbars/Main";
import FooterMain from "@/partials/footers/Main";
import NotificationMain from "@/partials/notifications/Main";
import HeaderMain from "@/partials/headers/Main";

export default function Home() {
	return (
		<LayoutBody bar={<NotificationMain />} header={<HeaderMain />} nav={<NavbarMain />} footer={<FooterMain />}>
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
