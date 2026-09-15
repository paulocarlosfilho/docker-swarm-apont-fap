const { Router } = require("express");
const controller = require("../controllers/inventory.controller");

const router = Router();

router.get("/", (req, res) => controller.listAll(req, res));
router.get("/:productId", (req, res) => controller.getByProductId(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.patch("/:productId/add", (req, res) => controller.addStock(req, res));
router.patch("/:productId/remove", (req, res) => controller.removeStock(req, res));

module.exports = router;
