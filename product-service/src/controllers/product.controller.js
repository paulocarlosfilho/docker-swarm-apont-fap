const productService = require("../services/product.service");

class ProductController {
  listAll(req, res) {
    try {
      const products = productService.listAll();
      return res.json(products);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  getById(req, res) {
    try {
      const product = productService.getById(req.params.id);
      return res.json(product);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  create(req, res) {
    try {
      const product = productService.create(req.body);
      return res.status(201).json(product);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  update(req, res) {
    try {
      const product = productService.update(req.params.id, req.body);
      return res.json(product);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }

  delete(req, res) {
    try {
      const result = productService.delete(req.params.id);
      return res.json(result);
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  }
}

module.exports = new ProductController();
