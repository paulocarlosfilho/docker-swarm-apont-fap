const express = require("express");
const cors = require("cors");
const inventoryRoutes = require("./src/routes/inventory.routes");

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "inventory-service", status: "UP" });
});

// Rotas de estoque
app.use("/inventory", inventoryRoutes);

app.listen(PORT, () => {
  console.log(`📦 Inventory Service rodando na porta ${PORT}`);
});
