import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// scrypt is a callback based function, so we need to promisify it (a promise based implementation)
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    // Generate a salt
    const salt = randomBytes(8).toString("hex");

    // Hash the salt and the password together
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString("hex")}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    // Destructure the stored password and salt from the stored password
    const [hashedPassword, salt] = storedPassword.split(".");

    // Hash the supplied password with the same salt
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString("hex") === hashedPassword;
  }
}
