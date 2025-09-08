import express from "express";
import supabase from "../db.js";
import { authMiddleware, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Get all orders with affiliate info
router.get("/orders", authMiddleware, isAdmin, async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_amount,
      commission,
      status,
      created_at,
      affiliates (id, name, email, referral_code)
    `);

  if (error) return res.status(400).json({ error });

  res.json(data);
});

// GET all affiliates with stats
router.get("/affiliates", authMiddleware, isAdmin, async (req, res) => {
    // try {
    //     const result = await pool.query(`
    //         SELECT a.id, a.name, a.email, a.referral_code,
    //          COALESCE(SUM(o.amount), 0) as sales,
    //          COALESCE(SUM(c.amount), 0) as commission
    //         FROM affiliates a
    //         LEFT JOIN orders o ON o.affiliate_id = a.id
    //         LEFT JOIN commissions c ON c.affiliate_id = a.id
    //         GROUP BY a.id
    //         ORDER BY sales DESC
    //         `);
        
    //     res.json(result.rows);
    // } catch (err) {
    //     console.error(err.message);
    //     res.status(500).json({ msg: "Server Error" });
    // }

    const { data, error } = await supabase
    .from("affiliate_stats")
    .select("*");
    
    return res.json(data)
});

export default router;