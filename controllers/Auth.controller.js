
import bcryptjs from 'bcryptjs';
import User from '../Models/User.model.js';


import jwt from 'jsonwebtoken';

export const SignUp = async (req,res,next)=>{

    const {nom,email,password} = req.body;

    // Vérifier si l'utilisateur existe déjà
    let utilisateur = await User.findOne({ email });

    if (utilisateur) {
      return res.status(400).json({ message: 'L\'utilisateur existe déjà' });
    }
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({
        nom,
        email,
        password:hashedPassword,
    });

    try {
        await newUser.save();

        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error)
    }
}
export const  SignIn =async (req,res,next)=>{
    const {email,password} = req.body;

    try {
        const validUser = await User.findOne({email});
        if(!validUser) return console.log((404,"User not found!"));

        const validPassword = bcryptjs.compareSync(password,validUser.password);
        if(!validPassword) return console.log((401,"Wrong credentials!"));

        const token  = jwt.sign({id:validUser._id},process.env.JWT_SECRET) //in .env you can put any string
        const {password:pass,...rest} = validUser._doc; // rest is the row of that user  without password
        res.cookie("access_token",token,{httpOnly:true}).status(200).json({rest,token})
    } catch (error) {
        next(error)
    }
}