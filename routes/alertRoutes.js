import express from "express";
import { getAlerts, addAlert } from "../controllers/alertController.js";

const router = express.Router();

router.route("/").get(getAlerts).post(addAlert);

export default router;