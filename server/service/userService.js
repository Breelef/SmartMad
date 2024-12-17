import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: {email},
    });
}

export async function createUser(email, password, name){
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const newUser = await prisma.user.create({
        data: {
            email,
            password,
            name
        }
    });
    return { id: newUser.id, name: newUser.name, email: newUser.email };
}