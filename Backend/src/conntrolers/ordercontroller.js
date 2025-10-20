// controllers/orderController.js
import Order from "../model/order.js";
import Cart from "../model/cart.js";
import Product from "../model/product.js";

// Create order from cart (Checkout)
export const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.product");
    
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Build order items with seller info
    const orderItems = [];
    let totalAmount = 0;

    for (const item of cart.items) {
      if (!item.product) continue; // Skip deleted products
      
      const product = await Product.findById(item.product._id);
      
      orderItems.push({
        product: product._id,
        seller: product.sellerId,
        title: product.title,
        price: product.price,
        quantity: item.quantity
      });
      
      totalAmount += product.price * item.quantity;
    }

    // Create the order
    const order = await Order.create({
      buyer: req.user._id,
      items: orderItems,
      totalAmount,
      status: "paid", // Mock payment - auto mark as paid
      shippingAddress,
      paymentInfo: {
        method: paymentMethod,
        transactionId: `TXN${Date.now()}`, // Mock transaction ID
        paidAt: new Date()
      }
    });

    // Clear the cart
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { $set: { items: [] } }
    );

    res.status(201).json({ 
      message: "Order placed successfully!", 
      order 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get buyer's order history
export const getBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("items.product")
      .populate("items.seller", "email")
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .populate("items.seller", "email")
      .populate("buyer", "email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check authorization
    if (order.buyer._id.toString() !== req.user._id.toString() && 
        req.user.role !== "seller") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get seller's orders (orders containing their products)
export const getSellerOrders = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can view their orders" });
    }

    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("items.product")
      .populate("buyer", "email")
      .sort({ createdAt: -1 });

    // Filter items to only show seller's products
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user._id.toString()
      );
      
      const sellerTotal = sellerItems.reduce(
        (sum, item) => sum + (item.price * item.quantity), 
        0
      );

      return {
        ...order.toObject(),
        items: sellerItems,
        sellerTotal
      };
    }).filter(order => order.items.length > 0);

    res.json(sellerOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get seller analytics data
export const getSellerAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can view analytics" });
    }

    // Get all orders containing seller's products
    const orders = await Order.find({ 
      "items.seller": req.user._id,
      status: { $in: ["paid", "shipped", "delivered"] }
    }).populate("items.product");

    // Calculate total revenue
    let totalRevenue = 0;
    let totalOrders = 0;
    let productsSold = 0;
    const revenueByMonth = {};
    const topProducts = {};

    orders.forEach(order => {
      const sellerItems = order.items.filter(
        item => item.seller.toString() === req.user._id.toString()
      );

      sellerItems.forEach(item => {
        const revenue = item.price * item.quantity;
        totalRevenue += revenue;
        productsSold += item.quantity;

        // Track by month
        const monthYear = new Date(order.createdAt).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short' 
        });
        revenueByMonth[monthYear] = (revenueByMonth[monthYear] || 0) + revenue;

        // Track top products
        const productId = item.product?._id?.toString() || "Unknown";
        if (!topProducts[productId]) {
          topProducts[productId] = {
            name: item.title,
            quantity: 0,
            revenue: 0
          };
        }
        topProducts[productId].quantity += item.quantity;
        topProducts[productId].revenue += revenue;
      });

      if (sellerItems.length > 0) totalOrders++;
    });

    // Format revenue by month for chart
    const revenueChart = Object.entries(revenueByMonth).map(([month, revenue]) => ({
      month,
      revenue
    }));

    // Get top 5 products
    const topProductsList = Object.entries(topProducts)
      .map(([id, data]) => data)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    res.json({
      totalRevenue,
      totalOrders,
      productsSold,
      averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      revenueChart,
      topProducts: topProductsList
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};