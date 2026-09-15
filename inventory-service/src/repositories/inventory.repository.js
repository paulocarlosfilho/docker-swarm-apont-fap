// In-memory store para estoque
const inventory = [];

class InventoryRepository {
  findAll() {
    return inventory;
  }

  findByProductId(productId) {
    return inventory.find((i) => i.productId === productId) || null;
  }

  create(item) {
    inventory.push(item);
    return item;
  }

  updateQuantity(productId, quantity) {
    const item = inventory.find((i) => i.productId === productId);
    if (!item) return null;

    item.quantity = quantity;
    item.lastUpdated = new Date().toISOString();
    return item;
  }
}

module.exports = new InventoryRepository();
