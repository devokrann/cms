import { writeFile } from "fs";
import { join } from "path";

export const config = {
	api: {
		bodyParser: false,
	},
};

export async function POST(req: Request) {
	try {
		const data = await req.formData();
		const file: File | null = data.get("file") as unknown as File;

		if (!file) {
			return Response.json({ success: false });
		} else {
			const bytes = await file.arrayBuffer();
			const buffer = Buffer.from(bytes);

			// With the file data in the buffer, you can do whatever you want with it.
			// For this example, we'll save it to the public directory
			const path = join(process.cwd(), "/images/uploads/posts", file.name);
			await writeFile(path, buffer);

			console.log(`Open ${path} to see the uploaded file`);

			return Response.json({ success: true });
		}
	} catch (error) {
		console.error("x-> Error uploading file:", error);
		throw error;
	}
}
