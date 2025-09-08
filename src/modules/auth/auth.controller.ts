import * as validators from "./auth.validation.js";
import { validation } from "../../middleware/validation.middleware.js";
import { Router } from "express";
import authService from "./auth.service.js";
const router: Router = Router();
router.post("/signup", validation(validators.signup), authService.signup);
router.patch("/confirm-email", validation(validators.confirmEmail), authService.confirmEmail
);

router.post("/login",validation(validators.login) ,authService.login);

export default router;
