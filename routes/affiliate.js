// backend/routes/affiliate.js
import express from "express";
import supabase from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Middleware to verify JWT
function verifyToken(req, res, next) {
    const token = req.headers["authorization"];
    if(!token) return res.status(401).json({ error: "No token" });

    jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).json({ error: "Invalid token" });
        req.affiliateId = decoded.id;

        next();
    });
}

//Dashboard stats
router.get("/stats", verifyToken, async (req, res) => {
    const affiliateId = req.affiliateId;

    const { count: clickCount } = await supabase
        .from("clicks")
        .select("*", { count: "exact", head: true })
        .eq("affilate_id", affiliateId);

    const { data: orders } = await supabase
        .from("orders")
        .select("order_amount, commission")
        .eq("affiliate_id", affiliateId);
        
    const totalSales = orders.reduce((sum, o) => sum + o.order_amount, 0);
    const totalCommission = orders.reduce((sum, o) => sum + o.commission, 0);

    res.json({ clicks: clickCount, sales: totalSales, commission: totalCommission });
});

export default router;