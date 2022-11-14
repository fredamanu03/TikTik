import type { NextApiRequest, NextApiResponse } from "next";
import { uuid } from "uuidv4";
import { client } from "../../../utils/client";
import {
  allPostsQuery,
  postDetailQuery,
  singleUserQuery,
  userCreatedPostsQuery,
  userLikedPostsQuery,
} from "../../../utils/queries";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { id } = req.query;

    const query = singleUserQuery(id);
    const userVideosQuery = userCreatedPostsQuery(id);
    const userLikedVideosQuery = userLikedPostsQuery(id);

    const user = await client.fetch(query);
    const userVideos = await client.fetch(userVideosQuery);
    const userLikedVideos = await client.fetch(userLikedVideosQuery);

    res.status(200).json({ user, userVideos, userLikedVideos });
  }
}
