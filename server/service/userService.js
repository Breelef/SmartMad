import {PrismaClient} from '@prisma/client';
import {extractAuthToken, verifyToken} from "../auth/authHelpers.js";

const prisma = new PrismaClient();

export async function findUserByEmail(email) {
    console.log('Searching for user with email:', email);
  const user = await prisma.user.findFirst({
    where: { email: email },
  });
  console.log(user); // Log the result
  return user;
}

export async function findUserById(id) {
    const findId = parseInt(id);
    return prisma.user.findUnique({
        where: {id: findId},
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

export const findAllUsers = async () => {
  try {
      return await prisma.user.findMany();
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

export const updateUser = async (id, name, email, password) => {
  try {
      return await prisma.user.update({
        where: {id: parseInt(id, 10)},
        data: {name, email, password},
    });
  } catch (error) {
    throw new Error('Failed to update user');
  }
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

export async function deleteUserByEmail(email) {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            console.log('User not found deleteByEmail');
            return null; 
        }

        await prisma.user.delete({
            where: { email: email },
        });

        console.log(`User with email ${email} deleted successfully`);
        return true;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Failed to delete user');
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