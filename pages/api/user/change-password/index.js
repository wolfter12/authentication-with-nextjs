import { getSession } from "next-auth/client";

import { connectToDatabase } from "../../../../helpers/db";
import { hashPassword, verifyPassword } from "../../../../helpers/auth";
import { validatePassword } from "../../auth/signup";

async function handler(req, res) {
  try {
    switch (req.method) {
      case "PATCH":
        const session = await getSession({ req });

        if (!session) {
          res.status(401).json({ message: "Not authenticated!" });
          return;
        }

        const { email } = session.user;
        const { newPassword, oldPassword } = req.body;

        const normalizedNewPassword = newPassword.trim();
        const normalizedOldPassword = oldPassword.trim();

        const isNewPasswordValid = validatePassword(normalizedNewPassword);

        if (!isNewPasswordValid) {
          res.status(422).json({ message: "The new password is invalid!" });
          return;
        }

        const isOldPasswordValid = validatePassword(normalizedOldPassword);

        if (!isOldPasswordValid) {
          res.status(422).json({ message: "The old password is invalid!" });
          return;
        }

        if (normalizedNewPassword === normalizedOldPassword) {
          res.status(422).json({ message: "The password are equals!" });
          return;
        }

        const client = await connectToDatabase();

        const usersCollection = client.db().collection("users");

        const user = await usersCollection.findOne({ email });

        const { password: currentPassword } = user;

        if (!currentPassword) {
          res.status(404).json({ message: "User is not found!" });
          client.close();
          return;
        }

        const newPasswordAndCurrentAreEqual = await verifyPassword(
          normalizedNewPassword,
          currentPassword
        );

        if (newPasswordAndCurrentAreEqual) {
          res
            .status(422)
            .json({ message: "The new password does is equal to old!" });
          client.close();
          return;
        }

        const passwordsAreEqual = await verifyPassword(
          normalizedOldPassword,
          currentPassword
        );

        if (!passwordsAreEqual) {
          res.status(422).json({ message: "Old password is invalid" });
          client.close();
          return;
        }

        console.log("normalizedNewPassword", normalizedNewPassword);
        const hashedNewPassword = await hashPassword(normalizedNewPassword);

        const result = await usersCollection.updateOne(
          { email },
          {
            $set: {
              password: hashedNewPassword,
            },
          }
        );

        client.close();

        res.status(200).json({ message: "Password is updated!" });

        return;

      default:
        return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong!");
  }
}

export default handler;
