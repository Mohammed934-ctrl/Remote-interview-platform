import { Router } from "express";
import { ProtectRoute } from "../Middleware/ProtectRoute.js";
import { getStreamtoken } from "../Controllers/Chatcontroller.js";

const router = Router();

router.get("/token", ProtectRoute,getStreamtoken);

export default router;
