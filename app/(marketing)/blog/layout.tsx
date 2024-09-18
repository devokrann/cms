import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";

import contact from "@/data/contact";

export interface typeParams {
	blogId: string;
}

export const metadata: Metadata = {
	title: { default: "Blog", template: `%s - Blog - ${contact.name.app}` },
};

export default function Blog({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody>{children}</LayoutBody>;
}
