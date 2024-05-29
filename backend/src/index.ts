import express from "express";
import prisma from "./db";
import { validateBody } from "./middleware/validation";
import { UserSchema } from "./schema";

const app = express();

app.use(express.json());

// POST /create-user
app.post("/create-user", validateBody(UserSchema), async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      // If user exists, send a 400 error
      res.status(400).send("User already exists");
    } else {
      // If user does not exist, create a new user
      await prisma.user.create({
        data: {
          email,
          name,
        },
      });

      // Fetch all users after creation
      const users = await prisma.user.findMany();
      res.status(200).send(users);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
