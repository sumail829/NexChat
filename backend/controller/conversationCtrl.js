import prisma from "../db/db.js";


//its the chat room
export const createConversation = async (req, res) => {
  const { memberIds, name } = req.body; 

  if (!memberIds || memberIds.length < 2) {
    return res.status(400).json({ message: "At least two users are required" });
  }

  try {
    const conversation = await prisma.conversation.create({
      data: {
        name,
        members: {
          create: memberIds.map((userId) => ({ userId })),// it will make an array so i have used map
        },
      },
      include: { members: true },
    });

    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not create conversation", details: error });
  }
};

//here we can get the participants of the conversation
export const getUserConversation=async(req,res)=>{
    try {
        const {userId}=req.params;
        const memberships=await prisma.conversationMember.findMany({
            where:{userId:parseInt(userId)},
            include:{conversation:{
                include:{members:true}
            }},
        });

        const conversations = memberships.map(m => m.conversation);
        res.status(200).json( conversations );
    } catch (error) {
         console.error(error);
    res.status(500).json({ error: "Server error", details: error });
    }
}

// model Conversation {
//   id        Int        @id @default(autoincrement())
//   name      String?
//   createdAt DateTime   @default(now())

//   members   ConversationMember[]
//   messages  Message[]
// }
export const addMembers = async (req, res) => {
  try {
    const { conversationId, memberIds } = req.body; // memberIds = [userId1, userId2]

    if (!memberIds || memberIds.length === 0) {
      return res.status(400).json({ message: "No members to add" });
    }

    const newMembers = await prisma.conversationMember.createMany({
      data: memberIds.map(userId => ({
        userId,
        conversationId
      })),
      skipDuplicates: true, // avoid duplicate entries
    });

    res.status(201).json({ message: "Members added", count: newMembers.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not add members", details: error });
  }
};

// Remove a member from a conversation
export const removeMember = async (req, res) => {
  const { conversationId, userId } = req.body;

  try {
    await prisma.conversationMember.deleteMany({
      where: { conversationId, userId },
    });
    res.status(200).json({ message: "Member removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not remove member", details: err });
  }
};
