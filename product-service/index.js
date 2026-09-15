const express = require("express");
const cors = require("cors");
const productRoutes = require("./src/routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ service: "product-service", status: "UP" });
});

// Rotas de produtos
app.use("/products", productRoutes);

app.listen(PORT, () => {
  console.log(`🛒 Product Service rodando na porta ${PORT}`);
});
