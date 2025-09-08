// backend/routes/referral.js
import express from "express";
import supabase from "../db.js";

const router = express.Router();

// Track clicks
router.get("/:refCode/:productId", async (req, res) => {
    const { refCode, productId } = req.params;

    //Find affiliate
    const { data: affiliate, error} = await supabase
        .from("affiliates")
        .select("id")
        .eq("referral_code", refCode)
        .single();
    
    if(!affiliate) return res.statusCode(400).json({ error : "Invalid Referral" });

    //Save Click
    await supabase
        .from("clicks")
        .insert([{ affiliate_id: affiliate.id, product_id: productId }]);

    res.json({ message: "Click Recorded" });
});

export default router;