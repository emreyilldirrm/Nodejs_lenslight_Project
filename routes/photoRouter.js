import express, { Router } from 'express'
import *as photoController  from '../controller/photoController.js'
const router = express.Router()


router.post("/", photoController.createPhoto)
// router.route("/").post(photoController.createPhoto), //şeklinde de yazılabilir

router.get("/",photoController.getAllPhotos)
//router.route("/").post(photoController.createPhoto).get(photoController.getAllPhotos) //şeklinde de yazılabilir

router.get("/:id",photoController.getAPhoto)

router.delete("/:id",photoController.deletePhoto)

router.put("/:id",photoController.updatePhoto)

export default router