const jwt=require("jsonwebtoken")

const middleware = async (req,res,next)=>{
    const h=req.headers.authorization
    
    if(!h)return res.status(401).json({msg:"No token"})

    const t=h.split(" ")[1]
    
    if(!t)return res.status(401).json({msg:"Invalid token"})

    try{
        const d=jwt.verify(t,process.env.JWT_SECRET)
        req.user=d
        next()
    }catch(e){
        res.status(401).json({msg:"Token expired or invalid"})
    }
}
module.exports={middleware}
