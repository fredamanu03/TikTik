import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { GoVerified } from "react-icons/go";
import Link from "next/link";
import { useRouter } from "next/router";

import VideoCard from "../../components/VideoCard";
import NoResults from "../../components/NoResults";
import { IUser, Video } from "../../types";
import useAuthStore from "../../store/authStore";
import { BASE_URL } from "../../utils";

const SearchTerm = ({
  videos,
  searchTerm,
}: {
  videos: Video[];
  searchTerm: string;
}) => {
  const router = useRouter();
  // const { searchTerm } = router.query;
  const [isAccounts, setIsAccounts] = useState(true);
  const accounts = isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const isVideos = !isAccounts ? "border-b-2 border-black" : "text-gray-400";
  const { allUsers }: { allUsers: IUser[] } = useAuthStore();

  const searchedAccounts = allUsers.filter((user) =>
    user.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex gap-10 mb-10 mt-10 border-b-2 border-gray-200 bg-white w-full">
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${accounts}`}
          onClick={() => setIsAccounts(true)}
        >
          Accounts
        </p>
        <p
          className={`text-xl font-semibold cursor-pointer mt-2 ${isVideos}`}
          onClick={() => setIsAccounts(false)}
        >
          Videos
        </p>
      </div>
      {isAccounts ? (
        <div className="md:mt-16">
          {searchedAccounts.length > 0 ? (
            searchedAccounts.map((account, index) => (
              <Link href={`/profile${account._id}`} key={index}>
                <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded border-b-2 border-gray-200">
                  <div>
                    <Image
                      src={account.image}
                      width={50}
                      height={50}
                      className="rounded-full"
                      alt="user profile"
                    />
                  </div>
                  <div className="">
                    <p className="flex gap-1 items-center text-md font-bold text-primary lowercase">
                      {account.userName.replace(/\s/g, "")}
                      <GoVerified className="text-blue-400" />
                    </p>
                    <p className="text-xs capitalize text-gray-400">
                      {account.userName}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <NoResults text={`No account found for ${searchTerm}`} />
          )}
        </div>
      ) : (
        <div className="md:mt-16 flex flex-wrap gap-6 md:justify-start">
          {videos.length ? (
            videos.map((video, index) => (
              <VideoCard post={video} key={index} fromWhere="searchpage" />
            ))
          ) : (
            <NoResults text={`No videos found for ${searchTerm}`} />
          )}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = async ({
  params: { searchTerm },
}: {
  params: { searchTerm: string };
}) => {
  const response = await axios.get(`${BASE_URL}/api/search/${searchTerm}`);
  return {
    props: { videos: response.data, searchTerm },
  };
};

export default SearchTerm;
