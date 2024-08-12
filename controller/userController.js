import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import Photos from '../models/photo_models.js'

const createUser = async (req,res) =>{

    try {
        const user = await User.create(req.body)
        res.status(201).json({
            user: user._id
        })
    } catch (error) {
        console.log(error)
        let errors2 = {}

        if(error.code == 11000){    
            errors2.email = "The email is already"
        }
        
        if(error.name === "ValidationError"){
  
            Object.keys(error.errors).forEach((key) =>{
                errors2[key] = error.errors[key].message
            })
    
            console.log("ERR::02",errors2)
        
            }
            res.status(400).json(errors2)
       
    }
}

const loginUser = async (req,res) =>{
    try {
        const {username,password} = req.body
        const user = await User.findOne({ username })
        console .log(User)
        let same = false
        if(user){
            same = await bcrypt.compare(password, user.password)
        }else{
           return  res.status(401).json(
                {
                    succeded:false,
                    error:"There is no such a user"
                }
            )
        }

        if(same){
            const token = createToken(user._id)
            res.cookie('jsonwebtoken',token,{
                httpOnly:true,
                maxAge : 1000 *60 *60*24
            })

          res.redirect("/users/dashboard")    
        }else{
            res.status(401).json(
                {
                    succeded:false,
                    error:"Passwords are no matched "
                }
            )
        }

    } catch (error) {
        res.status(500).json(
            {
                succeded:false,
                error
            }
        )
    }
}

const createToken = (userId) => {
    return jwt.sign({userId},process.env.JWT_SECRET_KEY,{
        expiresIn:"1d"
    })
}

const getDashboardPage = async(req,res)=>{

    const photos = await Photos.find({user: res.locals.user._id })
    const users = await User.findById({_id: res.locals.user._id }).populate(["followers","followings"])
    res.render("dashboard.ejs",{
        link:'dashboard',
        photos,
        users
    })
}

const getAllusers = async (req,res) => {
    try {
        const users = await User.find({ _id: {$ne : res.locals.user._id }})//$ne operatörü MongoDB'de "eşit değil"
                                                                            //anlamına gelir
        res.status(200).render('users',{
            users,
            link:"users"
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

const getAuser = async (req,res) => {
    try {
        const user = await User.findById({_id : req.params.id})

        const inFollow = user.followers.some((follow) =>{
            return follow.equals(res.locals.user._id)
        })
        console.log(inFollow)

        const photos = await Photos.find({ user : req.params.id })

        res.status(200).render('user.ejs',{
            user,
            photos,
            link:"users",
            inFollow
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

const follow = async (req,res) => {
    try {
        let user = await User.findByIdAndUpdate(
            { _id : req.params.id },
            {
                $push :{ followers: res.locals.user._id }
            },
            {new:true }
        )

        user = await User.findByIdAndUpdate(
            { _id : res.locals.user._id },
            {
                $push :{ followings: req.params.id }
            },
            {new:true }
        )
        
        res.redirect(`/users/${req.params.id}`)
        
    } catch (error) {
        res.status(500).json(
            {
                succeded:false,
                error
            }
        )
    }
}

const unfollow = async (req,res) => {
    try {
        let user = await User.findByIdAndUpdate(
            { _id : req.params.id },
            {
                $pull :{ followers: res.locals.user._id }
            },
            {new:true }
        )

        user = await User.findByIdAndUpdate(
            { _id : res.locals.user._id },
            {
                $pull :{ followings: req.params.id }
            },
            {new:true }
        )
        
        res.redirect(`/users/${req.params.id}`)
        
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
    createUser,
    loginUser,
    getDashboardPage,
    getAllusers,
    getAuser,
    follow,
    unfollow
   
   
}