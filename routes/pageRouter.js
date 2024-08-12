import express from 'express'
import *as pageController  from '../controller/pageController.js'
const router = express.Router()

router.get("/",pageController.home)
router.get("/about",pageController.about)
router.get("/register",pageController.register)
router.get("/login",pageController.login)
router.get("/logOut", pageController.logOut)
router.get("/contact", pageController.contact)

router.post("/contact", pageController.sendMail)

export default router