const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User_model = require('../../models/user');
require('dotenv').config();

const login = async(req,res) => {
    try{
        console.log(req.body);
        const {email , password} = req.body;
        const user = await User_model.findOne({email , password});
        if(user){
            const token = jwt.sign({email} , process.env.SECRET);
            if(token){
                return res.status(200).json({
                    status: 1,
                    'success': true,
                    'message' : 'user authenticated',
                    'access' : true,
                    'UserData' : user,
                    'token' : token,
                })
            }else{
                return res.status(500).json({
                    status : 0,
                    'success': false,
                    'message' : 'Unable to create token',
                    'access' : false,
                    'UserData' : user,
                })
            }
        }else{
            return res.status(400).json({
                status : 0,
                'success': false,
                'message' : 'user not found',
                'access' : false,
                'UserData' : user
            })
        }   
    }catch(e){
        return res.status(404).json({
            status : 0,
            'success': false,
            'message' : 'Sonething went wrong',
            'access' : false,
            'error' : e.message
        })
    }
}

const generateRandomUserId = () => {
    // Generate a random string of characters (6 characters in this case)
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  
    // Get the current timestamp in milliseconds
    const timestamp = Date.now().toString(36).toUpperCase();
  
    // Combine the random part and timestamp
    const userId = `USER-${randomPart}-${timestamp}`;
  
    return userId;
  }

const signup  = async(req,res) => {
    try{
        console.log("Signup" , req.body);
        const {email, name , password, contact} = req.body;
        const userID = generateRandomUserId(); 
        const user = await User_model.create({userID, email, name , password , contact});
        if(user){
            return res.status(200).json({
                status : 1,
                'success': true,
                'message' : 'user Registered',
                'access' : true,
                'UserData' : user
            })
        }else{
            return res.status(400).json({
                status : 0,
                'success': false,
                'message' : 'user not Registered',
                'access' : false,
                'UserData' : user
            })
        }   
    }catch(e){
        return res.status(404).json({
            status : 0,
            'success': false,
            'message' : 'Sonething went wrong Backend Error',
            'access' : false,
            'error' : e.message
        })
    }
}


module.exports = {login , signup};