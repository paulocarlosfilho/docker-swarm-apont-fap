const { Router } = require("express");
const controller = require("../controllers/order.controller");

const router = Router();

router.get("/", (req, res) => controller.listAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", (req, res) => controller.create(req, res));

module.exports = router;
