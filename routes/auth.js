import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../db.js";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
    
    const { name, email, password = "admin123" } = req.body;
    

    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = "REF" + Math.floor(Math.random() * 100000);

    const {data, error} = await supabase
        .from("affiliates")
        .insert([{name, email, password_hash : hashedPassword, referral_code : referralCode}])
        .select();

    if(error) return res.status(400).json({ error });

    res.json({ message: "Affiliate Registered", affiliate: data[0] });
});

//LOGIN
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const {data, error} = await supabase
        .from("affiliates")
        .select("*")
        .eq("email", email)
        .single();
    
    if(error || !data) return res.status(400).json({ error: "Invalid Credentials" });

    const validPass = await bcrypt.compare(password, data.password_hash);
    if(!validPass) return res.status(400).json({ error: "Invalid Credentials" });

    const token = jwt.sign({ id: data.id, referral_code : data.referral_code, role: data.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({ token, 
                affiliate: { 
                    id: data.id, 
                    email: data.email,
                    referral_code: data.referral_code, 
                    role: data.role } });
});

export default router;