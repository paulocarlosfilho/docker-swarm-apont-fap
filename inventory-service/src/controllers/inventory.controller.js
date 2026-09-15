const inventoryService = require("../services/inventory.service");

class InventoryController {
  listAll(req, res) {
    try {
      const items = inventoryService.listAll();
      return res.json(items);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  getByProductId(req, res) {
    try {
      const item = inventoryService.getByProductId(req.params.productId);
      return res.json(item);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  create(req, res) {
    try {
      const item = inventoryService.create(req.body);
      return res.status(201).json(item);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  addStock(req, res) {
    try {
      const item = inventoryService.addStock(
        req.params.productId,
        req.body.quantity
      );
      return res.json(item);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  removeStock(req, res) {
    try {
      const item = inventoryService.removeStock(
        req.params.productId,
        req.body.quantity
      );
      return res.json(item);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new InventoryController();
