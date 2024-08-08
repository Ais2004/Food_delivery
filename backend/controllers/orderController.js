import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET);

const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // Validate request data
    if (!userId || !items || !amount || !address) {
      console.error("Invalid request data:", { userId, items, amount, address });
      return res.status(400).json({ success: false, message: 'Invalid request data' });
    }

    // Verify userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("Invalid userId:", userId);
      return res.status(400).json({ success: false, message: 'Invalid userId' });
    }

    // Create a new order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      status: 'Food processing',
      payment: false,
    });
    await newOrder.save();

    // Clear user's cart
    const user = await userModel.findById(userId);
    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.cartData = {}; // Clear the cart data
    await user.save();

    // Prepare line items for Stripe
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe expects amount in the smallest currency unit (e.g., paise)
      },
      quantity: item.quantity,
    }));

    // Add a higher delivery charge to meet the minimum amount requirement
    const deliveryCharge = 5000; // Example delivery charge in paise (₹50.00)
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge,
      },
      quantity: 1,
    });

    // Calculate the total amount
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCharge / 100;
    if (totalAmount < 0.50) {
      throw new Error('The total amount must convert to at least 50 cents.');
    }

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.CLIENT_DOMAIN}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.CLIENT_DOMAIN}/verify?success=false&orderId=${newOrder._id}`,
    });

    console.log(`Order placed: ${newOrder._id}`);
    return res.json({
      success: true,
      sessionId: session.id,
      message: "Your order has been placed.",
    });
  } catch (error) {
    console.error("Error in placeOrder:", error.message || error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    console.log("Verifying order with ID:", orderId, "Success status:", success);
  
    try {
      if (success === "true") {
        const order = await orderModel.findByIdAndUpdate(orderId, { payment: true });
        if (order) {
          console.log("Order payment updated successfully:", orderId);
          res.json({ success: true, message: "Order Placed." });
        } else {
          console.log("Order not found:", orderId);
          res.json({ success: false, message: "Order not found." });
        }
      } else {
        const order = await orderModel.findByIdAndDelete(orderId);
        if (order) {
          console.log("Order deleted due to failed payment:", orderId);
          res.json({ success: false, message: "Payment failed." });
        } else {
          console.log("Order not found to delete:", orderId);
          res.json({ success: false, message: "Order not found." });
        }
      }
    } catch (error) {
      console.log("Error in verifying order:", error);
      res.json({ success: false, message: "Payment verification failed. Try again later." });
    }
  };
  

const userOrder = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Order Fetching failed." });
  }
};

export { placeOrder, verifyOrder, userOrder };
