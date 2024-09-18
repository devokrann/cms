import { typeIpInfo } from "@/types/ipInfo";

export const getLocationData = async () => {
	try {
		// local retrieval (ip only)
		// const response = await fetch("/api/get-ip");
		// const result = await response.json();
		// setIp(result.ip);

		const request = await fetch(`https://ipinfo.io/json?token=${process.env.NEXT_IP_INFO_TOKEN}`);
		const response = await request.json();

		return response;
	} catch (error) {
		console.error("Error fetching location data:", error);
	}
};

// {
// 	ip: "41.90.106.247",
// 	city: "Nairobi",
// 	region: "Nairobi County",
// 	country: "KE",
// 	loc: "-1.2833,36.8167",
// 	org: "AS37061 Safaricom Limited",
// 	timezone: "Africa/Nairobi",
// }
