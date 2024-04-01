import { db } from "../dbconnetion/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from  'nodemailer';

////
// email config

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:'sonykumarprince460@gmail.com',
        pass:'pezvauioszpsokph'
    }
}) 

////
const auth = {
  register: async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try { 
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql,[email],async(error,result)=>{
       if(result.length>0){
        res.status(400).json({err:"Email is already in use"});
       }else{
        const hashedPassword = await bcrypt.hash(password, 10);
      console.log(hashedPassword);
      const insertSql = `INSERT INTO users (firstname, lastname, email, password) VALUES (?,?,?,?)`;
      db.query(
        insertSql,
        [firstname, lastname, email, hashedPassword],
        (err, result) => {
          if (!err) {
            res.status(201).json("User created");
          }
        })
       }
       })
   } catch (error) {
    res.status(500).json({err:error});
   }
   
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;
    
    try {
       db.query(sql,[email],async(error,result)=>{
        if(!result){
            res.status(500).json({err:'user is not exists in our database'}); 
        }
         const user_token = jwt.sign({ _id: result._id }, process.env.KEYSECRET, {
            expiresIn: "1d"
        });
         res.cookie("usercookie",user_token,{
            expires:new Date(Date.now()+9000000),
            httpOnly:true
        });
        res.status(200).json({
            data:result,
            token:user_token
        })
       })
    } catch (error) {
        res.status(500).json({err:error});
    }
  },
  logout: async (req, res) => {
    res.clearCookie("usercookie",null,{path:"/"});
    res.status(200).json({msg:"user logout successfully"})
  },

sendpasswordlink: async (req, res) => {

    const { email } = req.body;
    const sql = `SELECT * FROM users WHERE email = ?`;
    
    try {
       db.query(sql,[email],async(error,result)=>{
      
        if(!result){
            res.status(500).json({err:'user is not exists in our database'}); 
        }
         const user_token = jwt.sign({ _id: result._id }, process.env.KEYSECRET, {
            expiresIn: "300s"// valid for 5 minutes
        });
         const sql = `UPDATE users SET verify_token = ? WHERE email = ?`
         db.query(sql,[user_token,email],()=>{
            const sql = `SELECT * FROM users WHERE email = ?`;
            db.query(sql,[email],async(error,result)=>{
         
                const mailOptions = {
                    from:'sonykumarprince460@gmail.com',
                    to:email,
                    subject:"Sending Email For password Reset",
                    text:`This Link Valid For 5 MINUTES http://localhost:3000/forgotpassword/${result._id}/${result.verifytoken}`,
                    html: '<strong>and easy to do anywhere, even with Node.js</strong>'
                }
    
                transporter.sendMail(mailOptions,(error,info)=>{
                    if(error){
                        console.log("error",error);
                        res.status(401).json({status:401,message:"email not send"})
                    }else{
                        console.log("Email sent",info.response);
                        res.status(201).json({status:201,message:"Email sent Succsfully"})
                    }
                })
               
            })
           
         })
        res.status(200).json({
            msg: "link send successfully on user email"
        })
       })
    } catch (error) {
    res.status(500).json({err:error});
   }
},
setpassword: async (req, res) => {
 
    const {id,token} = req.params;

    const {password} = req.body;
    try {
        const mysql = `SELECT * FROM users WHERE _id = ? AND verify_token = ?`
        db.query(mysql, [id, token], async (validuser)=>{
           
            if (validuser) {
                const verifyToken = jwt.verify(token, process.env.KEYSECRET);
            
                if (verifyToken._id) {
                    const hashedPassword = await bcrypt.hash(password, 10);
            
                    const updateSql = `UPDATE users SET password =?, verify_token = null WHERE _id =?`;
                   db.query(updateSql, [hashedPassword, id],()=>{
                    res.status(201).json({message: "Password updated" })
                   });
                   
                } else {
                    res.status(401).json({message: "Invalid token" })
                }
            } else {
                res.status(401).json({message: "User not exist" })
            }
        });
    } catch (error) {
        res.status(500).json({err:error});
    }
  },
  
};
  

    

   

   

    

export default auth;
