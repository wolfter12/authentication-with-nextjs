import { hashPassword } from "../../../../helpers/auth";
import { connectToDatabase } from "../../../../helpers/db";

export function validateEmail(email) {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

export function validatePassword(password) {
  return password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/);
}

async function handler(req, res) {
  switch (req?.method) {
    case "POST":
      const data = req.body;

      const { email, password } = data;

      const normalizedEmail = email.trim().toLowerCase();
      const normalizedPassword = password.trim();

      if (!email || !validateEmail(normalizedEmail)) {
        res.status(422).json({ message: "Invalid email" });
        return;
      }

      if (!password || !validatePassword(normalizedPassword)) {
        res.status(422).json({ message: "Invalid password" });
        return;
      }

      const client = await connectToDatabase();

      const db = client.db();

      const existingUser = await db
        .collection("users")
        .findOne({ email: normalizedEmail });

      if (existingUser) {
        res.status(422).json({ message: "User exists already!" });
        client.close();
        return;
      }

      const hashedPassword = await hashPassword(normalizedPassword);

      const result = await db.collection("users").insertOne({
        email: normalizedEmail,
        password: hashedPassword,
      });

      res.status(201).json({ message: "Created user!" });
      client.close();
      break;

    default:
      break;
  }
}

export default handler;
