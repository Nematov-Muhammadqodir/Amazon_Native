import { useFollowings } from "@/hooks/useFollowings";
import React from "react";
import { Text, View } from "react-native";
import UserCardSimple from "./UserCardSimple";

export default function Followings() {
  const { followings } = useFollowings();

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
