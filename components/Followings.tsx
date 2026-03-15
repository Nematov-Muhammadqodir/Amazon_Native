import { userVar } from "@/apollo/store";
import { GET_MEMBER_FOLLOWINGS } from "@/apollo/user/query";
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

  followingData: Member;
}

interface GetMemberFollowingsInterface {
  getMemberFollowings: {
    list: FollowRelation[];
    metaCounter: TotalCounter;
  };
}

export default function Followings() {
  const user = useReactiveVar(userVar);
  const [initialInput, setInitialInput] = useState({
    page: 1,
    limit: 5,
    search: {
      followerId: user._id,
    },
  });
  const {
    loading: getMemberFollowingsLoading,
    data: getMemberFollowingsData,
    error: getMemberFollowingsError,
    refetch: getMemberFollowingsRefetch,
  } = useQuery<GetMemberFollowingsInterface>(GET_MEMBER_FOLLOWINGS, {
    fetchPolicy: "network-only",
    variables: { input: initialInput },
    skip: !initialInput?.search?.followerId,
    notifyOnNetworkStatusChange: true,
  });

  const followings = getMemberFollowingsData?.getMemberFollowings.list;

  return (
    <View>
      <Text className="font-bold font-JakartaBold text-[20px]">Followings</Text>

      {followings?.length ? (
        <View className="mt-5 gap-3">
          {followings?.map((item) => {
            console.log(item.followingData?.memberNick);

            return (
              <View key={item._id} className="">
                <UserCardSimple user={item.followingData} />
              </View>
            );
          })}
        </View>
      ) : (
        <View className="flex justify-center items-center h-full">
          <Text className="text-[25px]">No followings yet</Text>
        </View>
      )}
    </View>
  );
}
