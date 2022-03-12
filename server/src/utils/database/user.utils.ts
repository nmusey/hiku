import Prisma, { User } from "@prisma/client";
import { hashPassword } from "../cryptography.utils";

const prisma = new Prisma.PrismaClient();

export interface UserWithFollowers extends User {
    followers: User[];
}

export interface UserWithFollowing extends User {
    following: User[];
}

export interface UserWithFollowersAndFollowing extends UserWithFollowers, UserWithFollowing {
}

export const createUser = async (email: string, username: string, password: string, registrationToken: string): Promise<User> => {
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: { 
            email, 
            username, 
            password: hashedPassword, 
            registrationToken,
            following: {
                connect: { email }
            }
        }
    });
};

export const doesUserAlreadyExist = async (email: string, username: string): Promise<boolean> => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [ { email }, { username } ]
        }
    });

    return !!existingUser;
};

export const findUserById = async (id: number): Promise<User> => {
    return prisma.user.findUnique({ where: { id } });
};

export const findUserByUsername = async (username: string): Promise<User> => {
    return await prisma.user.findUnique({ where: { username } });
};

export const findUserWithFollowersAndFollowingByUsername = async (username: string): Promise<UserWithFollowersAndFollowing> => {
    return await prisma.user.findUnique({
        where: { username },
        include: { 
            followers: true,
            following: true
        }
    });
};

export const findUserByEmail = async (email: string): Promise<UserWithFollowers> => {
    return await prisma.user.findUnique({ 
        where: { email },
        include: { followers: true }
    });
};

export const findFollowedIds = async (userId: number): Promise<number[]> => {
    const allFollowedUserWithIds = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            following: {
                select: { id: true }
            }
        }
    });

    const allFollowedIds = allFollowedUserWithIds?.following.map(user => user.id);
    return allFollowedIds;
};

export const searchUsersByPartialUsername = async (searchTerm: string, cursor: number, usersToFind: number): Promise<UserWithFollowers[]> => {
    return await prisma.user.findMany({
        where: {
            username: {
                contains: searchTerm,
                mode: "insensitive"
            }
        },
        include: {
            followers: true
        },
        take: usersToFind,
        cursor: cursor === 1 ? undefined : { id: cursor },
        skip: cursor === 1 ? 0 : 1
    });
};

export const followUser = async (followerId: number, userIdToFollow: number): Promise<UserWithFollowers> => {
    return await prisma.user.update({
        where: { id: userIdToFollow },
        data: {
            followers: {
                connect: { id: followerId }
            }
        }, 
        include: {
            followers: true
        }
    });
};

export const unfollowUser = async (followerId: number, userIdToUnfollow: number): Promise<UserWithFollowers> => {
    return await prisma.user.update({
        where: { id: userIdToUnfollow },
        data: {
            followers: {
                disconnect: { id: followerId }
            }
        }, 
        include: {
            followers: true
        }
    });
};

export const deleteRegistrationTokenForUser = async (userId: number): Promise<void> => {
    await prisma.user.update({
        where: { id: userId },
        data: { registrationToken: "" }
    });
};

export const deleteUser = async (id: number): Promise<void> => {
    prisma.user.delete({ where: { id } });
};