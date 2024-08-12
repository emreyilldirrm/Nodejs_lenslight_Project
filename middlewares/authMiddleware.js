import jwt  from "jsonwebtoken"
import User from "../models/userModel.js"

const checkUser = async (req,res,next)=>{
    const token = req.cookies.jsonwebtoken

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY, async (err,decoded)=>{
            if(err){
                console.log(err.message)
                res.locals.user = null
                next()
            }else{
                const user =  await User.findById(decoded.userId)
                res.locals.user = user
                next()
            }

        })
    }else{
        res.locals.user = null
        next()
    }

}

const authenticateToken = async (req,res,next) => {
    try {
        const token = req.cookies.jsonwebtoken
        console.log("token :",token)

    if(token){
        await jwt.verify(token,process.env.JWT_SECRET_KEY,(err)=>{
            if(err){
                console.log(err),
                res.redirect("/login")
            }else{
                next()
            }
        })
    }else {
        res.redirect("/login")
    }
    } catch (error) {
        res.status(401).json({
            succeeded:false,
            error:"Not authorized"
        })
    }
        
}

export {
    authenticateToken,checkUser
}