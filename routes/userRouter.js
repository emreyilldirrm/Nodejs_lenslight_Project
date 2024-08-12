import express, { Router } from 'express'
import *as userController  from '../controller/userController.js'
import { authenticateToken } from '../middlewares/authMiddleware.js'
const router = express.Router()


router.post("/register", userController.createUser)
router.post("/login", userController.loginUser)

router.get("/dashboard",authenticateToken, userController.getDashboardPage)
router.get("/", authenticateToken, userController.getAllusers)
router.get("/:id", authenticateToken , userController.getAuser)

router.put("/:id/follow", authenticateToken , userController.follow)
router.put("/:id/unfollow", authenticateToken , userController.unfollow)




export default router