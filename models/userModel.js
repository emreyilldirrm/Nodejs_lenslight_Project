import mongoose from 'mongoose'
const Schema = mongoose.Schema; 
import bcrypt from 'bcrypt'
import validator from 'validator';
const user = new Schema(
  {
  username: { 
    type:String , 
    required:[true,"username area is required"] , 
    lowercase:true,
    validate:[validator.isAlphanumeric,"Only Alhanumeric characters"] 
  } ,
  email: { 
    type:String , 
    required:[true,"email area is required"] , 
    unique:true, 
    validate:[validator.isEmail,"Valid email is required"]
  },
  password: { 
    type:String , 
    required:[true,"password area is required"],
    minLength:[4,"At least 4 characters"]
  },
  followers: [
    {
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  ],
  followings: [
    {
      type:Schema.Types.ObjectId,
      ref:"User"
    }
  ]
},
{timestamps:true}
)

// pre middleware'i, belirli bir Mongoose modelinde bir belge 
// kaydedilmeden (save), güncellenmeden (update), kaldırılmadan (remove),
//  vb. önce çalıştırılacak kodları tanımlamak için kullanılır.
user.pre('save' , function(next) {
    const user = this;
    console.log("password : ", user.password);
    bcrypt.hash(user.password, 10, (err, hash) => {
        if(err) return next(err)
        user.password = hash;
        console.log("password hashed : ", user.password);

        // İşlem tamamlandığında next() ile devam et
        next();
    });
})

const User = mongoose.model('User', user);

export default User

