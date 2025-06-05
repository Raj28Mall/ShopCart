import express, { Request, Response, Router } from 'express';
import db from '../db'; // Assuming you might use DB later
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router: Router = express.Router();

const bannerUploadDir = path.join(__dirname, '../../frontend/public', 'banner_uploads');

router.use('/banner_uploads', express.static(bannerUploadDir));

// Create banner_uploads directory if it doesn't exist
if (!fs.existsSync(bannerUploadDir)) {
    fs.mkdirSync(bannerUploadDir, { recursive: true });
    console.log(`Created banner upload directory: ${bannerUploadDir}`);
}

// Configure disk storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, bannerUploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});

// POST a new banner
router.post('/', upload.single('image'), async (req: Request, res: Response) => {
    const { title, active } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
        return res.status(400).json({ message: "Banner image file is required." });
    }
    const imageUrl = `/banner_uploads/${imageFile.filename}`; 

    if (!title) {
        fs.unlink(imageFile.path, (err) => {
            if (err) console.error("Error deleting uploaded file after title validation fail:", err);
        });
        return res.status(400).json({ message: "Banner title is required." });
    }

    const isActive = active === 'true' || active === true;
    const QUERY = `INSERT INTO banner_images (title, image_url, active) VALUES (?, ?, ?)`;
    try {
        await db.execute(QUERY, [title, imageUrl, isActive]);
        res.status(201).json({message: "Banner added successfully"});

    } catch (error) {
        console.error("Error adding banner:", error);
        fs.unlink(imageFile.path, (err) => {
            if (err) console.error("Error deleting uploaded file after DB error:", err);
        });
        res.status(500).json({ message: "Error saving banner to database." });
    }
});

// GET all banners
router.get('/', async (req: Request, res: Response) => {
    const QUERY = "SELECT * FROM banner_images";
    try {
        const [results]: any = await db.execute(QUERY);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching banners:", error);
        res.status(500).json({ message: "Error fetching banners from database." });
    }
});

// DELETE a banner by ID
router.delete('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    const QUERY = "DELETE FROM banner_images WHERE id = ?";
    try {
        await db.execute(QUERY, [id]);
        res.status(200).json({ message: "Banner deleted successfully." });
    } catch (error) {
        console.error(`Error deleting banner ${id}:`, error);
        res.status(500).json({ message: "Error deleting banner from database." });
    }
});

// PUT (update) a banner by ID
router.put('/:id' , async (req: Request, res: Response) => {
    const { id } = req.params;
    const { active } = req.body;
    const dbActive= String(active);
    const QUERY1=`SELECT * FROM banner_images WHERE id = ?`;
    const [banner]= await db.execute(QUERY1, [id]);
    if(dbActive=="true" || dbActive=="false"){
        const QUERY2= `UPDATE banner_images SET active = ? WHERE id = ?`;
        try {
            await db.execute(QUERY2, [dbActive, id]);
            res.status(200).json({ message: "Banner updated successfully." });
        }
        catch (error) {
            console.error(`Error updating banner ${id}:`, error);
            res.status(500).json({ message: "Error updating banner in database." });
        }
    } else{
        res.status(400).json({ message: `Invalid active status. It should be 'true' or 'false'. Received ${typeof(dbActive)} ${dbActive}.` });
    }
});

export default router;
