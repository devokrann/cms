/** @type {import('next').NextConfig} */

const nextConfig = {
	sassOptions: {
		prependData: `@import "./styles/_mantine.scss";`,
	},

	images: {
		unoptimized: true,

		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: "https",
				hostname: "placehold.co",
				port: "",
				pathname: "/**",
			},
		],
	},

	webpack: config => {
		config.externals = [...config.externals, "bcrypt"];
		return config;
	},
};

export default nextConfig;
