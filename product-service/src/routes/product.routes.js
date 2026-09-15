const { Router } = require("express");
const controller = require("../controllers/product.controller");

const router = Router();

router.get("/", (req, res) => controller.listAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) => controller.create(req, res));
router.put("/:id", (req, res) => controller.update(req, res));
router.delete("/:id", (req, res) => controller.delete(req, res));

module.exports = router;
