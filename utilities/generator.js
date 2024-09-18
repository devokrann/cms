const crypto = require("crypto");

try {
	const buffer = crypto.randomBytes(64);
	console.log(`+-> Key generated(${buffer.length} bytes): ${buf.toString("hex")}`);
} catch (error) {
	console.error("x-> Key generation failure:", error.message);
}
