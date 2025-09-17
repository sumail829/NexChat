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
export const createMessage=async(req,res)=>{
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
        },
        include:{
            sender:true
        }
     })
       io.to(conversationId).emit("receiveMessage", message);
        return res.status(201).json({message:"text send successfully",message})
    } catch (error) {
         console.error(error);
    res.status(500).json({ error: "Could not send message", details: error });
    }
}

export const getMessage=async(req,res)=>{
    try {
        const {conversationId}=req.params;
        if(!conversationId){
            return res.status(400).json({message:"there is no converation with this id"})
        }
        const fetchMessage=await prisma.message.findMany({
            where:{conversationId:parseInt(conversationId,10)},
            include:{
                sender:{
                    select:{id:true,username:true,email:true}
                },
            },
            orderBy:{createdAt:"asc"}
        })
        res.status(200).json(fetchMessage);
        console.log(fetchMessage,"this is fetched message")
    } catch (error) {
        console.log("something went wrong",error)
            res.status(500).json({ error: "Could not fetch messages", details: error });
        
    }
}