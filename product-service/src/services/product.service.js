const { v4: uuidv4 } = require("uuid");
const productRepository = require("../repositories/product.repository");

class ProductService {
  listAll() {
    return productRepository.findAll();
  }

  getById(id) {
    const product = productRepository.findById(id);
    if (!product) {
      throw { status: 404, message: "Produto não encontrado" };
    }
    return product;
  }

  create({ name, description, price, sku }) {
    if (!name || !price) {
      throw { status: 400, message: "Nome e preço são obrigatórios" };
    }

    const product = {
      id: uuidv4(),
      name,
      description: description || "",
      price: Number(price),
      sku: sku || "",
      createdAt: new Date().toISOString(),
    };

    return productRepository.create(product);
  }

  update(id, data) {
    const product = productRepository.update(id, data);
    if (!product) {
      throw { status: 404, message: "Produto não encontrado" };
    }
    return product;
  }

  delete(id) {
    const deleted = productRepository.delete(id);
    if (!deleted) {
      throw { status: 404, message: "Produto não encontrado" };
    }
    return { message: "Produto removido com sucesso" };
  }
}

module.exports = new ProductService();
