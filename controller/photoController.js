import Photo from '../models/photo_models.js'
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

const createPhoto = async (req, res) => {

        // Kullanıcı doğrulama
        if (!res.locals.user || !res.locals.user._id) {
            return res.status(401).json({
                succeeded: false,
                error: "Kullanıcı doğrulanamadı."
            })
        }

        // Cloudinary'e fotoğraf yükleme
        const result = await cloudinary.uploader.upload(
            req.files.image.tempFilePath,  // tempFilePath büyük/küçük harf duyarlılığı
            {
                use_filename: true,
                folder: 'lenslight',  // lenslight string olarak verilmiş olmalı
            }
        )

        console.log("clodinary result:",result)

        // Fotoğraf kaydı
        const photo = await Photo.create({
            name: req.body.name,
            description: req.body.description,
            user: res.locals.user._id,
            url:result.secure_url,
            image_id:result.public_id
        })

        fs.unlinkSync(req.files.image.tempFilePath);
        res.status(201).redirect("/users/dashboard")

}


const getAllPhotos = async (req,res) => {
    try {
        const photos = res.locals.user 
        ? await Photo.find( { user : {$ne : res.locals.user._id }})
        : await Photo.find()
        res.status(200).render('photos',{
            photos,
            link:"photos"
        })
    } catch (error) {
        res.status(500).json(
            {
                succeded:false,
                error
            }
        )
    }
}

const getAPhoto = async (req,res) => {
    try {
        const photo = await Photo.findById({_id : req.params.id}).populate('user')
        
        let isOwner=false

        if (res.locals.user){
            isOwner = photo.user._id.equals(res.locals.user._id)
        }
     
        res.status(200).render('photo',{
            photo,
            isOwner,
            link:"photos"
        })
    } catch (error) {
        res.status(500).json(
            {
                succeded:false,
                error
            }
        )
    }
}

const deletePhoto = async (req,res) => {
    try {
    const photo = await Photo.findById(req.params.id)
    const image_id = photo.image_id

    await cloudinary.uploader.destroy(image_id)
    await Photo.findOneAndDelete({ _id: req.params.id })
    
    res.status(200).redirect("/users/dashboard")
    } catch (error) {
        res.status(500).json(
            {
                succeded:false,
                error
            }
        )
    }
}

const updatePhoto = async (req,res) => {
    try {
        const photo = await Photo.findById(req.params.id)
        if(req.files){
            const image_id = photo.image_id
            await cloudinary.uploader.destroy(image_id)

            const result = await cloudinary.uploader.upload(
                req.files.image.tempFilePath,  // tempFilePath büyük/küçük harf duyarlılığı
                {
                    use_filename: true,
                    folder: 'lenslight',  // lenslight string olarak verilmiş olmalı
                }
            )

            photo.image_id = result.public_id
            photo.url = result.secure_url

            fs.unlinkSync(req.files.image.tempFilePath);
        } 

        photo.name = req.body.name
        photo.description = req.body.description
        photo.save()

        res.status(200).redirect(`/photos/${req.params.id}`)
    } catch (error) {
        res.status(500).json(
            {
                succeded:false,
                error
            }
        )
    }
}

export {
    createPhoto,
    getAllPhotos,
    getAPhoto,
    deletePhoto,
    updatePhoto
   
}