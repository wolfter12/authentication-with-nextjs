import { getSession } from "next-auth/client";

async function handler(req, res) {
  try {
    switch (req.method) {
      case "PATCH":
        const { newPassword, oldPassword } = req.body;

        const session = await getSession({ req });

        if (!session) {
          res.status(401).json({ message: "Not authenticated!" });
        }

        break;

      default:
        return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Something went wrong!");
  }
}

export default handler;
