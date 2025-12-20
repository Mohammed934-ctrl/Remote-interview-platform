import { Router } from "express";
import { ProtectRoute } from "../Middleware/ProtectRoute.js";
import { Createsession, endsession, getactivesession, getmyrecentsession, getsessionbyid, joinsession } from "../Controllers/Sessioncontroller.js";


const router = Router()
//the / route is to createsession
router.post("/",ProtectRoute,Createsession)
router.get("/active",ProtectRoute,getactivesession)
router.get("/my-recent-session",ProtectRoute,getmyrecentsession)
router.get(":/id",ProtectRoute,getsessionbyid)
router.post(":/id/join",ProtectRoute,joinsession)
router.post(":/id/end",ProtectRoute,endsession)

export default router