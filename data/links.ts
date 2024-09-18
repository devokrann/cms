const links = {
	navbar: [
		{ link: "/", label: "Home" },
		{ link: "/about", label: "About" },
		{
			link: "/services",
			label: "Services",
			subLinks: [
				{ link: "/services/1", label: "Service One" },
				{ link: "/services/2", label: "Service Two" },
				{ link: "/services/3", label: "Service Three" },
			],
		},
		{
			link: "/blog",
			label: "Blog",
		},
		{
			link: "/contact",
			label: "Contact",
		},
	],
};

export default links;
