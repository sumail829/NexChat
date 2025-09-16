import express from "express";
import { addMembers, createConversation, getUserConversation } from "../controller/conversationCtrl.js";

const router=express.Router();

router.post("/conversation/create",createConversation);
router.get("/conversation/:userId",getUserConversation);
router.post("/conversation/addMember",addMembers);

export default router;