import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  const { name, email, password, role } = await req.json();
  const hashed = await hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
  });
  return Response.json(user);
}
