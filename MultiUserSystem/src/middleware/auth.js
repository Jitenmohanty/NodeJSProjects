import jwt from 'jsonwebtoken'


  const authentication = async(req,res,next)=>{
        const token = req.header("Authorization");

        if(!token){
            return res.status(401).json({ msg: 'No token, authorization denied' });
        }

        try {
            const decoded =  jwt.verify(token,process.env.JWT_SECRET);
            req.user = decoded;
        } catch (error) {
            res.status(401).json({ msg: 'Invalid token' });
        }

  }

  export default authentication;