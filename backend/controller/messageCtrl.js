import prisma from "../db/db.js";



// model Message {
//   id             Int           @id @default(autoincrement())
//   text           String
//   createdAt      DateTime      @default(now())
//   sender         User          @relation(fields: [senderId], references: [id])
//   senderId       Int
//   conversation   Conversation  @relation(fields: [conversationId], references: [id])
//   conversationId Int
// }
const createMessage=async(req,res)=>{
    const {conversationId,text,senderId}=req.body;
    try {
     if(!conversationId || !senderId || !text){
        return res.status(400).json({message:"conversationId , senderId and text are required"})
     }   
     const message=await prisma.message.create({
        data:{
            text,
            senderId,
            conversationId
        }
     })
        
    } catch (error) {
        
    }
}