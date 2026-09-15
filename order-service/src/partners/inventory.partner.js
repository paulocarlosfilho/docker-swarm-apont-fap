const axios = require("axios");

const INVENTORY_SERVICE_URL =
  process.env.INVENTORY_SERVICE_URL || "http://localhost:3002";

class InventoryPartner {
  /**
   * Consulta o estoque de um produto
   * @param {string} productId - ID do produto
   * @returns {object} dados de estoque
   */
  async getStock(productId) {
    try {
      const response = await axios.get(
        `${INVENTORY_SERVICE_URL}/inventory/${productId}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw { status: 404, message: "Estoque não encontrado para este produto" };
      }
      throw {
        status: 503,
        message: "Inventory Service indisponível",
      };
    }
  }

  /**
   * Remove quantidade do estoque de um produto
   * @param {string} productId - ID do produto
   * @param {number} quantity - quantidade a remover
   * @returns {object} estoque atualizado
   */
  async removeStock(productId, quantity) {
    try {
      const response = await axios.patch(
        `${INVENTORY_SERVICE_URL}/inventory/${productId}/remove`,
        { quantity }
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        throw {
          status: error.response.status,
          message: error.response.data.error || "Erro ao atualizar estoque",
        };
      }
      throw {
        status: 503,
        message: "Inventory Service indisponível",
      };
    }
  }
}

module.exports = new InventoryPartner();
