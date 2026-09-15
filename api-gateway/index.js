const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

// URLs dos serviços parceiros
const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";
const INVENTORY_SERVICE_URL =
  process.env.INVENTORY_SERVICE_URL || "http://localhost:3002";
const ORDER_SERVICE_URL =
  process.env.ORDER_SERVICE_URL || "http://localhost:3003";

app.use(cors());

// Health check do gateway
app.get("/health", (req, res) => {
  res.json({
    service: "api-gateway",
    status: "UP",
    partners: {
      productService: PRODUCT_SERVICE_URL,
      inventoryService: INVENTORY_SERVICE_URL,
      orderService: ORDER_SERVICE_URL,
    },
  });
});

// Proxy para Product Service
app.use(
  "/products",
  createProxyMiddleware({
    target: PRODUCT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/products": "/products" },
    on: {
      error: (err, req, res) => {
        console.error("❌ Product Service indisponível:", err.message);
        res.status(503).json({ error: "Product Service indisponível" });
      },
    },
  })
);

// Proxy para Inventory Service
app.use(
  "/inventory",
  createProxyMiddleware({
    target: INVENTORY_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/inventory": "/inventory" },
    on: {
      error: (err, req, res) => {
        console.error("❌ Inventory Service indisponível:", err.message);
        res.status(503).json({ error: "Inventory Service indisponível" });
      },
    },
  })
);

// Proxy para Order Service
app.use(
  "/orders",
  createProxyMiddleware({
    target: ORDER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { "^/orders": "/orders" },
    on: {
      error: (err, req, res) => {
        console.error("❌ Order Service indisponível:", err.message);
        res.status(503).json({ error: "Order Service indisponível" });
      },
    },
  })
);

app.listen(PORT, () => {
  console.log(`🚀 API Gateway rodando na porta ${PORT}`);
  console.log(`   → Products:  ${PRODUCT_SERVICE_URL}`);
  console.log(`   → Inventory: ${INVENTORY_SERVICE_URL}`);
  console.log(`   → Orders:    ${ORDER_SERVICE_URL}`);
});
