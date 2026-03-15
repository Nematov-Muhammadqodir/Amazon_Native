import { userVar } from "@/apollo/store";
import { GET_MEMBER_FOLLOWERS } from "@/apollo/user/query";
import { MeFollowed } from "@/types/follow/follow";
import { Member } from "@/types/member/member";
import { MeLiked, TotalCounter } from "@/types/product/product";
import { useQuery, useReactiveVar } from "@apollo/client/react";
import React, { useState } from "react";
import { Text, View } from "react-native";
import UserCardSimple from "./UserCardSimple";

export interface FollowRelation {
  _id: string;
  followingId: string;
  followerId: string;
  createdAt: Date;
  updatedAt: Date;

  meLiked?: MeLiked[];
  meFollowed?: MeFollowed[];

  followerData: Member;
}

interface GetMemberFollowersInterface {
  getMemberFollowers: {
    list: FollowRelation[];
    metaCounter: TotalCounter;
  };
}

export default function Followers() {
  const user = useReactiveVar(userVar);
  const [initialInput, setInitialInput] = useState({
    page: 1,
    limit: 5,
    search: {
      followingId: user._id,
    },
  });
  const {
    loading: getMemberFollowersLoading,
    data: getMemberFollowersData,
    error: getMemberFollowersError,
    refetch: getMemberFollowersRefetch,
  } = useQuery<GetMemberFollowersInterface>(GET_MEMBER_FOLLOWERS, {
    fetchPolicy: "network-only",
    variables: { input: initialInput },
    skip: !initialInput.search.followingId,
    notifyOnNetworkStatusChange: true,
  });

  const followers = getMemberFollowersData?.getMemberFollowers.list;
  console.log("followers", followers);
  return (
    <View>
      <Text className="font-bold font-JakartaBold text-[20px]">Followers</Text>
      {followers?.length ? (
        <View>
          {followers?.map((item) => {
            console.log(item.followerData.memberNick);
            return (
              <View key={item._id} className="">
                <UserCardSimple user={item.followerData} />
              </View>
            );
          })}
        </View>
      ) : (
        <View className="flex justify-center items-center h-full">
          <Text className="text-[25px]">No followers yet</Text>
        </View>
      )}
    </View>
  );
}
