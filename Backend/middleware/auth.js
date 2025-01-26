import jwt from 'jsonwebtoken';

const auth = async(req,res,next) =>{
    try{
        const token = req.headers['authorization']?.split(' ')[1];

        if(!token){
            return res.status(401).json({
                msg:"No token, authorization denied",
            })
        }
        jwt.verify(token,process.env.JWT_SECRET, (err,user)=>{
            if(err){
                return res.status(403).json({
                    msg:"Not valid user" + "\n" + err,
                });
            }
            // res.json({
            //     user,
            // })
            req.user = user;
            next();
        })
    }catch(err){
        console.log(err);
    }
}

export default auth;