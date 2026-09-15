const express = require("express");
const cors = require("cors");
const orderRoutes = require("./src/routes/order.routes");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "order-service", status: "UP" });
});

// Rotas de pedidos
app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`📋 Order Service rodando na porta ${PORT}`);
});
