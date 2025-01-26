import { Router } from "express";
import { getMessage, sendMessage } from "../controllers/message.controllers.js";
import auth from "../middleware/auth.js";
let router = Router({
    mergeParams:true,
});

// router.route("/sendMessage/:id").post();
router.post("/send/:id", auth,sendMessage);
router.get("/get/:id", auth,getMessage);
// router.get("/get/:id", getMessage);

export default router;