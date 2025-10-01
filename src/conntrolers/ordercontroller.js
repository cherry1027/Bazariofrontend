import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Product from "../model/product.js";


export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ buyerId: req.user._id }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const products = cart.products.map(p => ({
      productId: p.productId._id,
      quantity: p.quantity,
      price: p.productId.price
    }));

    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const order = await Order.create({
      buyerId: req.user._id,
      products,
      totalAmount
    });

    
    await Cart.findOneAndDelete({ buyerId: req.user._id });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id }).populate("products.productId");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getSellerOrders = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can view their orders" });
    }

    const orders = await Order.find({ "products.productId": { $exists: true } })
      .populate("products.productId")
      .populate("buyerId", "email");

   
    const sellerOrders = orders.map(order => ({
      ...order._doc,
      products: order.products.filter(p => p.productId.sellerId.toString() === req.user._id.toString())
    })).filter(o => o.products.length > 0);

    res.json(sellerOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
