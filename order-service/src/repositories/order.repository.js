// In-memory store para pedidos
const orders = [];

class OrderRepository {
  findAll() {
    return orders;
  }

  findById(id) {
    return orders.find((o) => o.id === id) || null;
  }

  create(order) {
    orders.push(order);
    return order;
  }

  updateStatus(id, status) {
    const order = orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  }
}

module.exports = new OrderRepository();
