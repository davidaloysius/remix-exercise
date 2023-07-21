export interface PostPayload {
  title: string;
  body: string;
  userId: number;
  id?: number;
}

export async function addPosts(payload: PostPayload) {
  const posts = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const content = await posts.json();
  
  return content;
}
