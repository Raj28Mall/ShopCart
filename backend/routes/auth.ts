// backend/routes/auth.ts
import express, {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { loginSchema } from "../../schemas/loginSchema";
import { signupSchema } from "../../schemas/signupSchema";
import { validate } from "./../middleware/validate";
import { date } from "zod";
import { v4 as uuidv4 } from 'uuid';
const router = express.Router();

// POST /api/login
router.post("/login", validate(loginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const QUERY = "SELECT * FROM users WHERE email = ?";
  try {
    const [results] = await db.execute(QUERY, [email]) as [any[], any];
    const user = results[0];
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env["JWT_SECRET"] as string,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
        dateJoined: user.created_at,
      },
    });
  } catch(error){
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/signup", validate(signupSchema), async (req: Request, res: Response) => {
  const { name, email, password, confirmPassword } = req.body;
  const id = uuidv4();
  const picture = null;
  const hashedPassword = await bcrypt.hash(password, 10);
  const QUERY = "INSERT INTO users (id, name, email, picture, password) VALUES (UUID_TO_BIN(?, 1), ?, ?, ?, ?)";
  try {
    await db.execute(QUERY, [id, name, email, picture, hashedPassword]);
    
    const token = jwt.sign(
      { id, email },
      process.env["JWT_SECRET"] as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: id,
        name,
        email,
        picture: null,
        role: "user",
        dateJoined: new Date(),
      },
    });
  } catch(error){
    console.error("Signup error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
