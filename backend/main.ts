import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes'; 
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import auth from './routes/auth';
import cors from 'cors'; 

const app = express();
const PORT = 5000;

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cors({origin: 'http://localhost:3000'}, ));

// Using productRoutes for any routes under "/api"
app.use('/product_api', productRoutes);
app.use("/order_api", orderRoutes);
app.use('/api/auth', auth);
app.use('/user_api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
