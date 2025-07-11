import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import USER from  '../models/user.model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginwithgoogel = async(req,res)=>{
    // res.send('Google login endpoint hit');
    let {token} = req.body;
    // console.log('Google token received:', token);
    try{
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience:process.env.GOOGLE_CLIENT_ID,
        })
        const payload = ticket.getPayload();
        const {sub,email,name} = payload;
        let user = await USER.findOne({email});
        if(!user){
            user = new USER({
                  name,
                  email,
                  password: ' ',
                });
                await user.save();
        }
        const jwtToken = jwt.sign({
            id: user.id,
        },process.env.JWT_SECRET,{expiresIn: '1h'});
        console.log('JWT token generated:', jwtToken); 
         res.json({ token: jwtToken,id: user.id });
    }catch(err){
        console.error('Error verifying Google token:', err.message);
        return res.status(401).json({error: 'Invalid Google token'});
    }
}
