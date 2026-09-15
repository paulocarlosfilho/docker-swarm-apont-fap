const axios = require("axios");

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:3001";

class ProductPartner {
  /**
   * Valida se um produto existe consultando o Product Service
   * @param {string} productId - ID do produto
   * @returns {object} dados do produto
   */
  async getProduct(productId) {
    try {
      const response = await axios.get(
        `${PRODUCT_SERVICE_URL}/products/${productId}`
      );
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw { status: 404, message: "Produto não encontrado no catálogo" };
      }
      throw {
        status: 503,
        message: "Product Service indisponível",
      };
    }
  }
}

module.exports = new ProductPartner();
