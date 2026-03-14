import { userVar } from "@/apollo/store";
import { SUBSCRIBE, UNSUBSCRIBE } from "@/apollo/user/mutation";
import { sweetErrorHandling } from "@/types/sweetAlert";
import { useMutation, useReactiveVar } from "@apollo/client/react";

export const useFollow = () => {
  const loggedInUser = useReactiveVar(userVar);

  const [subscribe] = useMutation(SUBSCRIBE);
  const [unSubscribe] = useMutation(UNSUBSCRIBE);

  const subscribeHandler = async (id: string, refetchUser?: any) => {
    try {
      await subscribe({
        variables: { input: id },
        update(cache) {
          const memberId = cache.identify({
            __typename: "Member",
            _id: id,
          });

          cache.modify({
            id: memberId,
            fields: {
              meFollowed() {
                return [
                  {
                    __typename: "MeFollowed",
                    followingId: id,
                    followerId: loggedInUser._id,
                    myFollowing: true,
                  },
                ];
              },
            },
          });
        },
      });

      if (refetchUser) {
        await refetchUser({ input: id });
      }
    } catch (err) {
      sweetErrorHandling(err);
    }
  };

  const unsubscribeHandler = async (id: string, refetchUser?: any) => {
    try {
      if (!id || !loggedInUser._id) return;

      await unSubscribe({
        variables: { input: id },
        update(cache) {
          const memberId = cache.identify({
            __typename: "Member",
            _id: id,
          });

          cache.modify({
            id: memberId,
            fields: {
              meFollowed() {
                return [
                  {
                    __typename: "MeFollowed",
                    followingId: id,
                    followerId: loggedInUser._id,
                    myFollowing: false,
                  },
                ];
              },
            },
          });
        },
      });

      if (refetchUser) {
        await refetchUser({ input: id });
      }
    } catch (err) {
      sweetErrorHandling(err);
    }
  };

  return {
    subscribeHandler,
    unsubscribeHandler,
  };
};
