const { v4: uuidv4 } = require("uuid");
const orderRepository = require("../repositories/order.repository");
const productPartner = require("../partners/product.partner");
const inventoryPartner = require("../partners/inventory.partner");

class OrderService {
  listAll() {
    return orderRepository.findAll();
  }

  getById(id) {
    const order = orderRepository.findById(id);
    if (!order) {
      throw { status: 404, message: "Pedido não encontrado" };
    }
    return order;
  }

  /**
   * Cria um pedido, validando produto e estoque via Partners
   * Fluxo:
   *  1. Valida se o produto existe (ProductPartner)
   *  2. Verifica e debita estoque (InventoryPartner)
   *  3. Registra o pedido como CONFIRMED
   */
  async create({ productId, quantity }) {
    if (!productId || !quantity) {
      throw { status: 400, message: "productId e quantity são obrigatórios" };
    }

    if (Number(quantity) <= 0) {
      throw { status: 400, message: "Quantidade deve ser maior que zero" };
    }

    // 1. Valida produto via Partner
    const product = await productPartner.getProduct(productId);

    // 2. Cria pedido como PENDING
    const order = {
      id: uuidv4(),
      productId,
      productName: product.name,
      quantity: Number(quantity),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    orderRepository.create(order);

    try {
      // 3. Debita estoque via Partner
      await inventoryPartner.removeStock(productId, Number(quantity));

      // 4. Confirma pedido
      orderRepository.updateStatus(order.id, "CONFIRMED");
      order.status = "CONFIRMED";
    } catch (err) {
      // Se falhar o estoque, cancela o pedido
      orderRepository.updateStatus(order.id, "CANCELLED");
      order.status = "CANCELLED";
      throw {
        status: err.status || 400,
        message: `Pedido cancelado: ${err.message}`,
      };
    }

    return order;
  }
}

module.exports = new OrderService();
