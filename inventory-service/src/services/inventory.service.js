const { v4: uuidv4 } = require("uuid");
const inventoryRepository = require("../repositories/inventory.repository");

class InventoryService {
  listAll() {
    return inventoryRepository.findAll();
  }

  getByProductId(productId) {
    const item = inventoryRepository.findByProductId(productId);
    if (!item) {
      throw { status: 404, message: "Estoque não encontrado para este produto" };
    }
    return item;
  }

  create({ productId, quantity }) {
    if (!productId) {
      throw { status: 400, message: "productId é obrigatório" };
    }

    // Verifica se já existe estoque para o produto
    const existing = inventoryRepository.findByProductId(productId);
    if (existing) {
      throw { status: 409, message: "Estoque já registrado para este produto" };
    }

    const item = {
      id: uuidv4(),
      productId,
      quantity: Number(quantity) || 0,
      lastUpdated: new Date().toISOString(),
    };

    return inventoryRepository.create(item);
  }

  addStock(productId, quantity) {
    if (!quantity || quantity <= 0) {
      throw { status: 400, message: "Quantidade deve ser maior que zero" };
    }

    const item = inventoryRepository.findByProductId(productId);
    if (!item) {
      throw { status: 404, message: "Estoque não encontrado para este produto" };
    }

    const newQuantity = item.quantity + Number(quantity);
    return inventoryRepository.updateQuantity(productId, newQuantity);
  }

  removeStock(productId, quantity) {
    if (!quantity || quantity <= 0) {
      throw { status: 400, message: "Quantidade deve ser maior que zero" };
    }

    const item = inventoryRepository.findByProductId(productId);
    if (!item) {
      throw { status: 404, message: "Estoque não encontrado para este produto" };
    }

    if (item.quantity < Number(quantity)) {
      throw { status: 400, message: "Estoque insuficiente" };
    }

    const newQuantity = item.quantity - Number(quantity);
    return inventoryRepository.updateQuantity(productId, newQuantity);
  }
}

module.exports = new InventoryService();
