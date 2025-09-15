import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

// Example: create a user
async function main() {
  const user = await prisma.user.create({
    data: {
      username: "samir",
      email: "samir@example.com",
      password: "hashedpassword"
    }
  });
  console.log(user);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

  export default prisma;