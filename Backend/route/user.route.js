import { register,login, getUser,beingConnect, forgotPassword, verifyOtp, resetPassword, acceptConnection} from "../controllers/user.controllers.js";
import { Router } from "express";
import { loginwithgoogel } from "../utils/googleAuth.js";
import auth from "../middleware/auth.js";
const router = Router({
    mergeParams:true,
});

router.post("/register",register);
router.post("/login",login);
// router.get("/getuser/:id",auth,getUser);
router.post("/beginconnect/:id", auth, beingConnect);
// router.get("/connect/:id",auth,getAllconnections);
router.get("/getDetails/:id",auth,getUser);
router.post("/googellogin",loginwithgoogel);
router.post("/forgotpassword", forgotPassword);
router.post("/verifyOtp",verifyOtp);
router.post("/resetPassword",resetPassword);
router.post('/acceptConnection', auth, acceptConnection);
export default router;