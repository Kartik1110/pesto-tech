import { Router } from "express";
import prisma from "../db";
import { validateBody } from "../middleware/validation";
import { TaskSchema, UpdateTaskSchema } from "../schema";

const taskRouter = Router();

// GET /tasks
taskRouter.get("/get-tasks", async (req, res) => {
  try {
    const userId = req.query.userId as string;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    } else {
      const tasks = await prisma.task.findMany({
        where: {
          userId,
        },
      });
      res.status(200).send(tasks);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// POST /create-task
taskRouter.post("/create-task", validateBody(TaskSchema), async (req, res) => {
  try {
    const { title, description, userId } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    } else {
      await prisma.task.create({
        data: {
          title,
          description,
          userId,
        },
      });
    }

    const tasks = await prisma.task.findMany();
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

// PUT /update-task
taskRouter.put("/update-task", validateBody(UpdateTaskSchema), async (req, res) => {
  try {
    const { title, description, userId, taskId, status } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).send("User not found");
    } else {
      const task = await prisma.task.findUnique({
        where: {
          id: taskId,
          AND: {
            userId,
          }
        },
      });

      if (!task) {
        return res.status(404).send("Task not found");
      } else {
        await prisma.task.update({
          where: {
            id: taskId,
          },
          data: {
            title,
            description,
            status,
          },
        });
      }
    }

    const tasks = await prisma.task.findMany();
    res.status(200).send(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
})

// DELETE /delete-task
taskRouter.delete("/delete-task", async (req, res) => {
  try {
    const taskId = req.query.taskId as string;
    const userId = req.query.userId as string;

    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
        AND: {
          userId,
        }
      },
    });

    if (!task) {
      return res.status(400).send("Task not found")
    } else {
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });
      res.status(200).send("Task deleted successfully");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
})

export default taskRouter;
