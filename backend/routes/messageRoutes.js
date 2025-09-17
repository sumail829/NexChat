import express from "express";
import { createMessage, getMessage } from "../controller/messageCtrl.js";

const router=express.Router();

router.post("/message/create",createMessage);
router.get("/message/:conversationId",getMessage);

export default router;