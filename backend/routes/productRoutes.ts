import express, {Request, Response, Router} from 'express';
import db from '../db'; 
const router: Router = express.Router();
import multer from 'multer';
import path from 'path';
import fs from 'fs'; 

const uploadDir = path.join(__dirname, '../../frontend/public', 'uploads'); 
router.use('/uploads', express.static(uploadDir));

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created upload directory: ${uploadDir}`);
}

// Configure disk storage for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
    } else {
        // Pass an error to cb if the file is not an image
        cb(new Error('Only image files are allowed!'));  
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 } // 10 MB limit per file
});

const productUploads = upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'additionalImages', maxCount: 5 } // Allow up to 5 additional images
]);

//route for getting a single product by id
router.get('/products/:id', async(req: Request, res: Response)=>{
    const productId = req.params["id"];
    const QUERY="SELECT * FROM products WHERE id=?";
    try{
        const [results]: any = await db.query(QUERY, [productId]);
        if (results.length === 0) {
            res.status(404).send("Product not found");
            return;
        }
        res.status(200).send(results[0]);
    } catch(err){
        console.error("Error while fetching product by ID: ", err);
        res.status(500).send("Database error while fetching product by ID");
    }
});

//route for getting all additional images of a product by id
router.get('/products/images/:id', async(req: Request, res: Response)=>{
    const productId = req.params["id"];
    const QUERY="SELECT * FROM product_images WHERE product_id=?";
    try{
        const [results]: any = await db.query(QUERY, [productId]);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching product images by ID: ", err);
        res.status(500).send("Database error while fetching product images by ID");
    }
});

//route for getting the details of a single product by id
router.get('/products/details/:id', async(req: Request, res: Response)=>{
    const productId = req.params["id"];
    const QUERY="SELECT * FROM product_details WHERE product_id=?";
    try{
        const [results]: any = await db.query(QUERY, [productId]);
        if (results.length === 0) {
            res.status(200).send([]);
            return;
        }
        const productDetails = results.map((row: any) => ({
            parameter: row.parameter,
            detail: row.detail
        }));
        res.status(200).send(productDetails);
    } catch(err){
        console.error("Error while fetching product details by ID: ", err);
        res.status(500).send("Database error while fetching product details by ID");
    } 
});

//route for getting all current products
router.get('/products', async(req: Request, res: Response)=>{
    const QUERY="SELECT * FROM products";
    try{
        const [results] = await db.execute(QUERY);
        res.status(200).send(results);
    } catch(err){
        console.error("Error while fetching all products: ", err);
        res.status(500).send("Database error while fetching all products");
    }
})

//route for editing a single product by id
router.put('/products/:id', upload.single('image'), async (req: Request, res: Response) => {
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const ratingPattern = /^\d(\.\d{1})?$/; 

    const productId = req.params["id"];
    const { name, category, price, rating, stock, shortDescription, longDescription, status } = req.body;
    const imageFile = req.file;

    let imagePathToSave: string | null = null; 
    let oldImagePathToDelete: string | null = null;

    try {
        const GET_QUERY = "SELECT * FROM products WHERE id=?";
        const [existingResults]: any = await db.query(GET_QUERY, [productId]);

        if (existingResults.length === 0) {
            if (imageFile) {
                fs.unlink(imageFile.path, (err) => {
                    if (err) console.error("Error deleting uploaded file after product not found:", err);
                });
            }
            res.status(404).send("Product not found.");
        }
        const existingProduct = existingResults[0];
        imagePathToSave = existingProduct.image; 

        if (imageFile) {
            imagePathToSave = `/uploads/${imageFile.filename}`; 
            oldImagePathToDelete = existingProduct.image;
        } 

        if (!name || !category || !shortDescription || !longDescription || price === undefined || rating === undefined || stock === undefined || status === undefined) {
            if (imageFile) {
                fs.unlink(imageFile.path, (err) => {
                    if (err) console.error("Error deleting uploaded file after validation fail:", err);
                });
            }
            res.status(400).send("Incomplete text field data for the product");
        }

        const priceStr = price.toString();
        if (!pricePattern.test(priceStr)) {
            if (imageFile) { fs.unlink(imageFile.path, (err) => { if (err) console.error("Error deleting file on price validation fail:", err); }); }
            res.status(400).send("Price must be a valid decimal with up to two decimal places (e.g., 10.99)");
        }
        const numericPrice = Number(priceStr);

        const stockStr = stock.toString();
        const numericStock = Number(stockStr);
        if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
            if (imageFile) { fs.unlink(imageFile.path, (err) => { if (err) console.error("Error deleting file on stock validation fail:", err); }); }
            res.status(400).send("Stock must be a non-negative integer");
        }
        const integerStock = parseInt(stockStr, 10);

        const ratingStr = rating.toString();
        if (!ratingPattern.test(ratingStr)) { 
             if (imageFile) { fs.unlink(imageFile.path, (err) => { if (err) console.error("Error deleting file on rating format validation fail:", err); }); }
             res.status(400).send("Rating must be a number with up to one decimal place (e.g., 4.5)");
        }
        const numericRating = parseFloat(ratingStr);
        if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) { 
            if (imageFile) { fs.unlink(imageFile.path, (err) => { if (err) console.error("Error deleting file on rating range validation fail:", err); }); }
            res.status(400).send("Rating must be between 0.0 and 5.0");
        }

        const values = [
            name,
            category,
            Number(numericPrice.toFixed(2)),
            imagePathToSave,              
            Number(numericRating.toFixed(1)),
            integerStock,
            shortDescription,
            longDescription,
            status,
            productId
        ];

        const UPDATE_QUERY = `UPDATE products SET name=?, category=?, price=?, image=?, rating=?, stock=?, shortDescription=?, longDescription=?, status=? WHERE id=?`;
        await db.query(UPDATE_QUERY, values);

        if (oldImagePathToDelete && oldImagePathToDelete !== imagePathToSave) {
            const absoluteOldPath = path.join(uploadDir, path.basename(oldImagePathToDelete)); 
            console.log(`Attempting to delete old image file: ${absoluteOldPath}`);
            fs.unlink(absoluteOldPath, (err) => {
                if (err && err.code !== 'ENOENT') { 
                    console.error(`Error deleting OLD image file ${absoluteOldPath}:`, err);
                } 
            });
        }
        res.status(200).send("Product updated successfully");
    } catch (err) {
        console.error(`Error while updating product ${productId}: `, err);
        if (imageFile) {
            fs.unlink(imageFile.path, (unlinkErr) => {
                if (unlinkErr) console.error("Error deleting uploaded file during error handling:", unlinkErr);
            });
        }
        res.status(500).send("Database or server error while updating product");
    }
});

router.post('/products/', productUploads, async (req: Request, res: Response) => {
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const ratingPattern = /^\d(\.\d{1})?$/ 
    
    const { name, category, price, rating, stock, shortDescription, longDescription, status } = req.body;
    
    // Access files from req.files (because of upload.fields)
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImageFile = files?.['mainImage']?.[0];
    const additionalImageFiles = files?.['additionalImages'] || [];

    const uploadedFilePaths: string[] = [];
    if (mainImageFile) uploadedFilePaths.push(mainImageFile.path);
    additionalImageFiles.forEach(file => uploadedFilePaths.push(file.path));

    const cleanupFiles = () => {
        uploadedFilePaths.forEach(filePath => {
            fs.unlink(filePath, (err) => {
                if (err) console.error(`Error deleting uploaded file ${filePath} after error:`, err);
            });
        });
    };
    
    if (!mainImageFile) {
        additionalImageFiles.forEach(file => fs.unlink(file.path, err => {if (err) console.error(`Cleanup error for ${file.path}`, err)}));
        res.status(400).send("Main image file is required and must be a valid image type.");
        return;
    }
    const mainImagePath = `/uploads/${mainImageFile.filename}`;

    if (!name || !category || !shortDescription || !longDescription || price === undefined || rating === undefined || stock === undefined || status === undefined) {
        cleanupFiles();
        res.status(400).send("Incomplete text field data for the product");
        return;
    }

    const priceStr = price.toString();
    if (!pricePattern.test(priceStr)) {
        cleanupFiles();
        res.status(400).send("Price must be a valid decimal with up to two decimal places (e.g., 10.99)");
        return;
    }
    const numericPrice = Number(priceStr); 

    const stockStr = stock.toString();
    const numericStock = Number(stockStr); 
    if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
        cleanupFiles();
        res.status(400).send("Stock must be a non-negative integer");
        return;
    }
    const integerStock = parseInt(stockStr, 10); 

    const ratingStr = rating.toString();
    const numericRating = parseFloat(ratingStr); 
    if (!ratingPattern.test(ratingStr) || isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
        cleanupFiles();
        res.status(400).send("Rating must be a number between 0.0 and 5.0, with up to one decimal place (e.g., 4.5)");
        return;
    }

    const productQuery = `INSERT INTO products (name, category, price, image, rating, stock, shortDescription, longDescription, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const productValues = [
        name,
        category,
        Number(numericPrice.toFixed(2)),
        mainImagePath, 
        Number(numericRating.toFixed(1)),
        integerStock,
        shortDescription,
        longDescription,
        status,
    ];

    let connection;
    try {
        connection = await db.getConnection(); // Get a connection for transaction
        await connection.beginTransaction();

        const [productResults]: any = await db.query(productQuery, productValues);
        const productId = productResults.insertId;

        if (!productId) {
            await connection.rollback();
            cleanupFiles();
            res.status(500).send("Failed to create product, no product ID obtained.");
            return;
        }

        if (additionalImageFiles.length > 0) {
            const productImagesQuery = `INSERT INTO product_images (product_id, image_url) VALUES ?`;
            const additionalImageValues = additionalImageFiles.map(file => [productId, `/uploads/${file.filename}`]);
            await connection.query(productImagesQuery, [additionalImageValues]);
        }

        await connection.commit();
        res.status(201).send({ message: "Product successfully added", productId: productId });

    } catch (err) {
        if (connection) await connection.rollback();
        cleanupFiles();
        console.error("Error while adding product to database: ", err);
        res.status(500).send("Error saving product data to the database");
    } finally {
        if (connection) connection.release();
    }
});

//route for deleting a single product by id
router.delete('/products/:id', async (req: Request, res: Response) => {
    const productId = req.params["id"];
    const QUERY = `DELETE FROM products WHERE id = ?`;
    try {
        const [results]: any = await db.query(QUERY, [productId]);
        if (results.affectedRows === 0) {
            res.status(404).send("Product not found");
        }
        res.status(200).send("Product deleted successfully");
    } catch (err) {
        console.error("Error while deleting product: ", err);
        res.status(500).send("Database error while deleting product");
    }
});


// dev prupose only bulk route
router.post('/products/bulk', async (req: Request, res: Response) => {
    const products = req.body.products;
    if (!Array.isArray(products) || products.length === 0) {
        res.status(400).send("No products provided");
    }

    const values = products.map((product: any) => {
        const { name, category, price, image, rating, stock, shortDescription, longDescription, status } = product;
        [ name, category, Number(parseFloat(price).toFixed(2)), image, Number(parseFloat(rating).toFixed(1)), parseInt(stock), shortDescription, longDescription, status ];
    });

    const QUERY = `INSERT INTO products (name, category, price, image, rating, stock, shortDescription, longDescription, status) VALUES ?`;

    try {
        await db.query(QUERY, [values]);
        res.status(201).send("Products added successfully");
    } catch (err) {
        console.error("Error while adding products: ", err);
        res.status(500).send("Database error while adding products");
    }
});
export default router;
