// In-memory store para produtos
const products = [];

class ProductRepository {
  findAll() {
    return products;
  }

  findById(id) {
    return products.find((p) => p.id === id) || null;
  }

  create(product) {
    products.push(product);
    return product;
  }

  update(id, data) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...data };
    return products[index];
  }

  delete(id) {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  }
}

module.exports = new ProductRepository();
