import { useFollowers } from "@/hooks/useFollowers";
import React from "react";
import { Text, View } from "react-native";
import UserCardSimple from "./UserCardSimple";

export default function Followers() {
  const { followers } = useFollowers();

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
