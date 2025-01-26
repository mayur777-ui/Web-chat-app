import { register,login, getUser,beingConnect, getAllconnections} from "../controllers/user.controllers.js";
import { Router } from "express";
import auth from "../middleware/auth.js";
const router = Router({
    mergeParams:true,
});

router.post("/register",register);
router.post("/login",login);
// router.get("/getuser/:id",auth,getUser);
router.post("/beginconnect/:id", auth, beingConnect);
router.get("/connect/:id",auth,getAllconnections);
router.get("/getDetails/:id",auth,getUser);
export default router;