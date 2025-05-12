import express, {Request, Response} from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../db";
import { loginSchema } from "../../schemas/loginSchema";
import { signupSchema } from "../../schemas/signupSchema";
import { validate } from "./../middleware/validate";
import { date } from "zod";
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from "./../middleware/requireAuth";
const router = express.Router();

router.get("/admins", async (req: Request, res: Response) => {
    const status = req.query["status"] as string || "active";
    const QUERY = 'SELECT * FROM users WHERE (role="admin" OR role="superadmin") AND status=?';
    try {
        const [results] = await db.execute(QUERY, [status]) as [any[], any];

        if (!results || results.length === 0) {
            return res.status(200).json([]);
        }
        
        const admins = results.map(admin => {
            if (admin.id && Buffer.isBuffer(admin.id)) {
                admin.id = admin.id.toString('hex'); 
            }
            return admin;
        });
        return res.status(200).send(admins);
    } catch (err) {
        console.error("Error while fetching admins: ", err);
        return res.status(500).json({ message: "Database error while fetching admins", error: err });
    }
});

router.put("/admins/:email/:status", async (req: Request, res: Response) => {
    const email = req.params["email"];
    const status = req.params["status"];
    let QUERY: string;
    
    if(status === "approved"){
        QUERY = `UPDATE users SET status="active" WHERE email=?`;
    }
    else if(status === "rejected"){
        QUERY = `UPDATE users SET role="user", status="active" WHERE email=?`;
    }
    else {
        return res.status(400).json({ message: "Invalid admin status" });
    }
    
    try {
        const [result] = await db.execute(QUERY, [email]) as [any, any];
        return res.status(200).json({ 
            message: "Admin status updated successfully",
            result: result
        });
    } catch (err) {
        console.error("Error while updating admin status: ", err);
        return res.status(500).json({ message: "Database error while updating admin status", error: err });
    }
});

export default router;