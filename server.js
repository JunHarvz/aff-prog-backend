import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import referralRoutes from "./routes/referral.js";
import orderRoutes from "./routes/orders.js";
import affilateRoutes from "./routes/affiliate.js";
import adminRoutes from "./routes/admin.js";
import storeRoutes from "./routes/store.js";

dotenv.config();
const app = express();

//ExpressJS is responsible for cors and express.json 
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/referral", referralRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/affiliate", affilateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/store", storeRoutes);

const PORT = process.env.PORT ?? 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));