// backend/routes/auth.ts
import express, {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { LoginSchema } from "../../schemas/loginSchema";
import { validate } from "./../middleware/validate";
const router = express.Router();

// POST /api/login
router.post("/login", validate(LoginSchema), async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const QUERY = "SELECT * FROM users WHERE email = ?";
  try {
    const [results] = await db.execute(QUERY, [email]) as [any[], any];
    const user = results[0];
    if (!user) {
      res.status(401).json({ message: "Invalid username" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env["JWT_SECRET"] as string,
      { expiresIn: "1h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    });
  } catch(error){
    console.error("Login error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
