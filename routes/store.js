// backend/routes/store.js
import express from "express";
import supabase from "../db.js";

const router = express.Router();

// Get all products
router.get("/products", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error });
  res.json(data);
});

// Get single product
router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return res.status(404).json({ error: "Product not found" });
  res.json(data);
});

// Place an order (with referral)
router.post("/order", async (req, res) => {
  const { product_id, quantity, referral_code } = req.body;
  console.log(req.body);

  if (!product_id || !quantity) {
    return res.status(400).json({ error: "Product ID and quantity required" });
  }

  // Fetch product price
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, price")
    .eq("id", product_id)
    .single();

  if (productError || !product) {
    return res.status(400).json({ error: "Invalid product" });
  }

  const order_amount = product.price * quantity;

  // Find affiliate (optional)
  let affiliate = null;
  if (referral_code) {
    const { data: aff } = await supabase
      .from("affiliates")
      .select("id")
      .eq("referral_code", referral_code)
      .single();

    affiliate = aff ? aff.id : null;
  }

  // Insert order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      affiliate_id: affiliate,
      product_id: product_id,
      order_amount,
      commission: affiliate ? order_amount * 0.1 : 0,
      status: "pending"
    })
    .select()
    .single();

  if (orderError) return res.status(400).json({ error: orderError.message });

  res.json({ message: "Order placed successfully", order });
});

export default router;
