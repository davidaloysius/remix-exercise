export interface UserModel {
    id: number;
    username: string;
    name: string;
  }

export async function getUsers() {
    const users = await fetch(`https://jsonplaceholder.typicode.com/users`);
    return await users.json() as UserModel[];
} 