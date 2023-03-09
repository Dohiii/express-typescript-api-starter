import express from "express";
import { register, login, logout, allUsers } from "./auth.controllers";

const router = express.Router();

router.get("/", allUsers);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router;
