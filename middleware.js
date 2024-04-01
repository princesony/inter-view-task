import jwt from "jsonwebtoken";

const authenticate = async(req,res,next)=>{

    try {
        const token = req.headers.authorization;
        const token2 = req.cookies.usercookie;
      
        const verifytoken = jwt.verify(token,process.env.KEYSECRET);
        
        const rootUser = await userdb.findOne({_id:verifytoken._id});
        
        if(!rootUser) {throw new Error("user not found")}

        req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id

        next();

    } catch (error) {
        res.status(401).json({status:401,message:"Unauthorized no token provide"})
    }
}


export default  authenticate; 