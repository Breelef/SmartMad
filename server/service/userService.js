import {PrismaClient} from '@prisma/client';
import {extractAuthToken, verifyToken} from "../auth/authHelpers.js";

const prisma = new PrismaClient();

export async function findUserByEmail(email) {
    return prisma.user.findUnique({
        where: {email},
    });
}

export async function findUserById(id) {
    return prisma.user.findUnique({
        where: {id},
    });
}
export async function findUserByToken(req){
    try{
        const token = extractAuthToken(req);
        const decoded = verifyToken(token, process.env.JWT_SECRET);
        return findUserByEmail(decoded.email);
    }catch (e) {
        console.error('Error finding user:', e);
        throw e;
    }
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

export async function softDeleteUserById(id){
    try{
        const now = new Date();
        return await prisma.user.update({
            where: {id: parseInt(id)},
            data: {deletedAt: now},
        });
    }catch (error) {
        console.error('Error soft-deleting user:', error);
        throw error;
  }
}

export async function deleteUserPermanently(id){
    try{
        return await prisma.user.delete({
            where: { id: parseInt(id) }
        });
    }catch (error){
        console.error('Error permanently deleting user:', error);
        throw error;
    }
}