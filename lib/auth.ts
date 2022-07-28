import jwt from 'jsonwebtoken'
import{NextApiRequest,NextApiResponse} from 'next'
import prisma from './prisma'

export const validateRoute = (handler)=>{
    return async (req: NextApiRequest,res:NextApiResponse)=>{
        const token = req.cookies.TRAX_ACCESS_TOKEN

        if(token){
            let user

            try{
                const{id}=jwt.verify(token,'hello')
                user=await prisma.user.findUnique({
                    where:{id},
                })
                
                if(!user){
                    throw new Error('not real user')
                }
            }catch(error){
                res.status(401)
                res.json({error:'not authorized'})
                return 
            }

            return handler(req,res,user)
        }

        res.status(401)
        res.json({error:'not authorized'})
    }
}