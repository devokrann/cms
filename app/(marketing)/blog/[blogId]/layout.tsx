import React from "react";

import { Metadata } from "next";

import LayoutBody from "@/layouts/Body";
import AsideBlog from "@/partials/asides/Blog";

import posts from "@/data/blog";

import { typeParams } from "../layout";
import { linkify } from "@/handlers/parsers/string";

export const generateMetadata = ({ params }: { params: typeParams }): Metadata => {
	return { title: posts.find(p => linkify(p.titleLink) == params.blogId)?.title };
};

export default function Post({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return <LayoutBody aside={{ right: { component: <AsideBlog /> } }}>{children}</LayoutBody>;
}
