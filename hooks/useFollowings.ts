import { userVar } from "@/apollo/store";
import { GET_MEMBER_FOLLOWINGS } from "@/apollo/user/query";
import { MeFollowed } from "@/types/follow/follow";
import { Member } from "@/types/member/member";
import { MeLiked, TotalCounter } from "@/types/product/product";
import { useQuery, useReactiveVar } from "@apollo/client/react";

export interface FollowingRelation {
  _id: string;
  followingId: string;
  followerId: string;
  createdAt: Date;
  updatedAt: Date;
  meLiked?: MeLiked[];
  meFollowed?: MeFollowed[];
  followingData: Member;
}

interface GetMemberFollowingsResponse {
  getMemberFollowings: {
    list: FollowingRelation[];
    metaCounter: TotalCounter;
  };
}

export function useFollowings(page = 1, limit = 5) {
  const user = useReactiveVar(userVar);

  const {
    loading: followingsLoading,
    data: followingsData,
    error: followingsError,
    refetch: followingsRefetch,
  } = useQuery<GetMemberFollowingsResponse>(GET_MEMBER_FOLLOWINGS, {
    fetchPolicy: "network-only",
    variables: {
      input: {
        page,
        limit,
        search: { followerId: user._id },
      },
    },
    skip: !user._id,
    notifyOnNetworkStatusChange: true,
  });

  return {
    followingsLoading,
    followings: followingsData?.getMemberFollowings.list,
    followingsTotal: followingsData?.getMemberFollowings.metaCounter,
    followingsError,
    followingsRefetch,
  };
}