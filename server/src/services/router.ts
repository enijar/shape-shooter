import { Router } from "express";
import cookies from "../middleware/cookies";
import test from "../controllers/test";
import notFound from "../controllers/not-found";

const router = Router();

router.use([cookies]);

router.get("/test", test);

router.all("*", notFound);

export default router;
