const orderService = require("../services/order.service");

class OrderController {
  listAll(req, res) {
    try {
      const orders = orderService.listAll();
      return res.json(orders);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  getById(req, res) {
    try {
      const order = orderService.getById(req.params.id);
      return res.json(order);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  async create(req, res) {
    try {
      const order = await orderService.create(req.body);
      return res.status(201).json(order);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new OrderController();
