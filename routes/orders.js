// backend/routes/orders.js
import express from "express";
import supabase from "../db.js";

const router = express.Router();

// Create order (simulate purchase)
router.post("/", async (req, res) => {
    const { affiliateId, productId, orderAmount } = req.body;
    const commissionRate = 0.1; // 10% commission from affiliate
    const commission = orderAmount * commissionRate;
    console.log(productId);
    const { data, error } = await supabase
        .from("orders")
        .insert([{ affiliate_id : affiliateId, product_id: productId, order_amount: orderAmount, commission }])
        .select();

    if (error) return res.status(400).json({ error });

    res.json({ message: "Order recorded", order: data[0] });
});

export default router;