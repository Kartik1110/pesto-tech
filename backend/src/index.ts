import express from "express";
import userRouter from "./routes/user.route";

const app = express();

app.use(express.json());

// User routes 
app.use("/users", userRouter);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
