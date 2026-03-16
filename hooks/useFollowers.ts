import { userVar } from "@/apollo/store";
import { GET_MEMBER_FOLLOWERS } from "@/apollo/user/query";
import { MeFollowed } from "@/types/follow/follow";
import { Member } from "@/types/member/member";
import { MeLiked, TotalCounter } from "@/types/product/product";
import { useQuery, useReactiveVar } from "@apollo/client/react";

export interface FollowerRelation {
  _id: string;
  followingId: string;
  followerId: string;
  createdAt: Date;
  updatedAt: Date;
  meLiked?: MeLiked[];
  meFollowed?: MeFollowed[];
  followerData: Member;
}

interface GetMemberFollowersResponse {
  getMemberFollowers: {
    list: FollowerRelation[];
    metaCounter: TotalCounter;
  };
}

export function useFollowers(page = 1, limit = 5) {
  const user = useReactiveVar(userVar);

  const {
    loading: followersLoading,
    data: followersData,
    error: followersError,
    refetch: followersRefetch,
  } = useQuery<GetMemberFollowersResponse>(GET_MEMBER_FOLLOWERS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page,
        limit,
        search: { followingId: user._id },
      },
    },
    skip: !user._id,
    notifyOnNetworkStatusChange: true,
  });

  return {
    followersLoading,
    followers: followersData?.getMemberFollowers.list,
    followersTotal: followersData?.getMemberFollowers.metaCounter,
    followersError,
    followersRefetch,
  };
}