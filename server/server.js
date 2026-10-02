const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "George Portfolio Payment Server is running 🚀"
    });
});

app.post("/api/support", async (req, res) => {
    try {
        const { name, phone, amount } = req.body;

        // Validate input
        if (!name || !phone || !amount) {
            return res.status(400).json({
                success: false,
                message: "Name, phone number and amount are required."
            });
        }

        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid amount."
            });
        }
//

    let formattedPhone = phone.trim().replace(/\s+/g, "");

   // Convert 07XXXXXXXX or 01XXXXXXXX to 254XXXXXXXX
  if (/^(07|01)/.test(formattedPhone)) {
    formattedPhone = "254" + formattedPhone.substring(1);
  } else if (formattedPhone.startsWith("+254")) {
    formattedPhone = formattedPhone.substring(1);
  }

        // Basic Kenyan number validation (allows both 2547... and 2541...)
        if (!/^254[17]\d{8}$/.test(formattedPhone)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid Kenyan M-Pesa number."
            });
        }

        console.log("Support request:", {
            name,
            phone: formattedPhone,
            amount: numericAmount
        });

        /*
         * PayHero STK Push
         *
         * We will put the current PayHero request details here
         * using your API credentials from .env.
         */

        const response = await axios.post(
            "https://backend.payhero.co.ke/api/v2/payments",
            {
                amount: numericAmount,
                phone_number: formattedPhone,
                channel_id: Number(process.env.PAYHERO_CHANNEL_ID),
                provider: "m-pesa",
                external_reference: `SUPPORT-${Date.now()}`,
                customer_name: name
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Basic ${process.env.PAYHERO_API_KEY}`
                }
            }
        );

        console.log("PayHero response:", response.data);

        return res.json({
            success: true,
            message: "STK Push sent. Please check your M-Pesa phone.",
            data: response.data
        });

    } catch (error) {

        console.error(
            "Payment error:",
            error.response?.data || error.message
        );

        return res.status(500).json({
            success: false,
            message: "Unable to initiate M-Pesa payment.",
            error: error.response?.data || error.message
        });
    }
});

// ===============================
// PAYHERO CALLBACK
// ===============================

app.post("/api/payhero/callback", (req, res) => {
    try {
        console.log("=================================");
        console.log("📩 PAYHERO CALLBACK RECEIVED");
        console.log("=================================");

        console.log(JSON.stringify(req.body, null, 2));

        const callbackData = req.body;

        // PayHero sends the payment result to this endpoint.
        // Keep the raw callback visible while we're testing,
        // so we can confirm the exact response format.

        console.log("Payment callback received successfully.");

        // Always acknowledge the callback
        return res.status(200).json({
            success: true,
            message: "Callback received"
        });

    } catch (error) {

        console.error("Callback error:", error);

        return res.status(500).json({
            success: false,
            message: "Callback processing failed"
        });
    }
});





app.listen(PORT, () => {
    console.log(`🚀 Payment server running on port ${PORT}`);
});
