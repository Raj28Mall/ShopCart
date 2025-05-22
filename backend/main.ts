import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes'; 
import orderRoutes from './routes/orderRoutes';
import bannerRoutes from './routes/bannerRoutes'; // Added bannerRoutes import
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import cors from 'cors'; 

const app = express();
const PORT = 5000;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({origin: 'http://localhost:3000'}, ));

// Using productRoutes for any routes under "/api"
app.use('/api/auth', authRoutes);
app.use('/user_api', userRoutes);
app.use('/product_api', productRoutes);
app.use('/order_api', orderRoutes);
app.use('/banner_api', bannerRoutes); // Use banner routes with /banner_api prefix

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
