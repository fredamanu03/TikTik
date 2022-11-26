import type { NextPage } from "next";

import { Video } from "../types";
import axios from "axios";
import NoResults from "../components/NoResults";
import VideoCard from "../components/VideoCard";
import { BASE_URL } from "../utils";

interface IProps {
  videos: Video[];
}

const Home = ({ videos }: IProps) => {
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video: Video) => (
          <VideoCard key={video._id} post={video} fromWhere="homepage" />
        ))
      ) : (
        <NoResults text={"No Videos"} />
      )}
    </div>
  );
};

//only if you need to render a page whose data must be fetched at request time
export const getServerSideProps = async ({
  query: { topic },
}: {
  query: { topic: string };
}) => {
  let response = null;

  if (topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  } else {
    response = await axios.get(`${BASE_URL}/api/posts`);
  }

  return {
    props: {
      videos: response.data,
    },
  };
};

export default Home;
