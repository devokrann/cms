import bcryptjs from "bcryptjs";
import crypto from "crypto";

const SALT_ROUNDS = 10;

enum HashingAlgorithm {
	BCRYPT = "bcrypt",
	SHA256 = "sha256",
	SHA512 = "sha512",
}

// create function object
const hasher = {
	// create hashing function
	async hash(rawValue: string, algorithm: HashingAlgorithm = HashingAlgorithm.BCRYPT): Promise<string | undefined> {
		try {
			// handle different hashing algorithms
			switch (algorithm) {
				case HashingAlgorithm.BCRYPT:
					return await bcryptjs.hash(rawValue, SALT_ROUNDS);
				case HashingAlgorithm.SHA256:
					return crypto.createHash("sha256").update(rawValue).digest("hex");
				case HashingAlgorithm.SHA512:
					return crypto.createHash("sha512").update(rawValue).digest("hex");
				default:
					throw new Error("Unsupported hashing algorithm");
			}
		} catch (error) {
			console.error("Error hashing raw value:", error);
			return undefined;
		}
	},

	// create hash comparison function
	async compare(
		rawValue: string,
		hashedValue: string | null,
		algorithm: HashingAlgorithm = HashingAlgorithm.BCRYPT
	): Promise<boolean | null> {
		try {
			if (!hashedValue) {
				return null;
			}

			// handle different hashing algorithms
			switch (algorithm) {
				case HashingAlgorithm.BCRYPT:
					return await bcryptjs.compare(rawValue, hashedValue);
				case HashingAlgorithm.SHA256:
				case HashingAlgorithm.SHA512:
					const hash = crypto.createHash(algorithm).update(rawValue).digest("hex");
					return hash === hashedValue;
				default:
					throw new Error("Unsupported hashing algorithm");
			}
		} catch (error) {
			console.error("Error comparing raw value:", error);
			return null;
		}
	},
};

export default hasher;
