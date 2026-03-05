import { userVar } from "@/apollo/store";
import { UPDATE_MEMBER } from "@/apollo/user/mutation";
import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputField";
import { images } from "@/constants";
import { saveToken, updateUserInfo } from "@/libs/auth";
import { Messages, REACT_APP_API_URL } from "@/types/config";
import { MemberUpdate } from "@/types/member/member.update";
import { sweetErrorHandling, sweetMixinSuccessAlert } from "@/types/sweetAlert";
import { useMutation, useReactiveVar } from "@apollo/client/react";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useCallback, useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface UpdateMemberResponse {
  updateMember: {
    accessToken: string;
  };
}

export default function MyPage() {
  const user = useReactiveVar(userVar);
  const imgPath = `${REACT_APP_API_URL}/${user.memberImage}`;
  console.log("imgPath", user.memberImage === "");
  /** APOLLO REQUESTS **/
  const [updateMember] = useMutation<UpdateMemberResponse>(UPDATE_MEMBER);
  const [updateData, setUpdateData] = useState<MemberUpdate>({
    _id: "",
    memberImage: "",
    memberNick: "",
    memberPhone: "",
    memberAddress: "",
  });
  /** LIFECYCLES **/
  useEffect(() => {
    setUpdateData({
      ...updateData,
      memberNick: user.memberNick,
      memberPhone: user.memberPhone,
      memberAddress: user?.memberAddress,
      memberImage: user.memberImage,
    });
  }, [user]);

  const updateProfileHandler = useCallback(async () => {
    try {
      if (!user._id) throw new Error(Messages.error2);
      updateData._id = user._id;
      console.log("updateData updateProductHandler", updateData);
      const result = await updateMember({
        variables: {
          input: updateData,
        },
      });
      console.log("result", result);

      // @ts-ignore
      const jwtToken = result.data.updateMember?.accessToken;

      if (jwtToken) {
        console.log("jwtToken", jwtToken);
        await saveToken(jwtToken);
        updateUserInfo(jwtToken);
      }
      await sweetMixinSuccessAlert("Information updated successfully!");
    } catch (err: any) {
      console.log("Error, updateProfileHandler", err);
      sweetErrorHandling(err).then();
    }
  }, [updateData]);
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        <View>
          <View className="bg-gray-100 p-4">
            <View className="relative items-center">
              <Image
                source={images.backImage}
                className="w-full h-56 rounded-3xl"
                resizeMode="cover"
              />

              <View className="absolute -bottom-16 items-center">
                <View className="bg-white p-2 rounded-full">
                  {user.memberImage !== "" || null ? (
                    <Image
                      source={{ uri: imgPath }}
                      className="w-32 h-32 rounded-full"
                    />
                  ) : (
                    <Image
                      source={images.defaultUser}
                      className="w-32 h-32 rounded-full"
                    />
                  )}

                  <Pressable className="absolute bottom-2 right-2 bg-blue-500 p-2 rounded-full">
                    <EvilIcons name="pencil" size={18} color="black" />
                  </Pressable>
                </View>
              </View>
            </View>

            <View className="h-20" />
          </View>
          <View className="flex justify-center items-center">
            <View className="flex flex-row justify-center items-center gap-1">
              <Text className="text-[20px] font-JakartaBold">
                {updateData.memberNick}
              </Text>
              <MaterialIcons name="verified" size={24} color="#155FEF" />
            </View>
            <View className="flex flex-row items-center">
              <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
                Online
              </Text>
              <View className="w-[2px] h-4 bg-[#155FEF] mx-2" />
              <Text className="text-[16px] text-[#155FEF] font-JakartaSemiBold">
                {user.memberType}
              </Text>
            </View>
          </View>
          <View className="flex flex-row justify-center mt-5 gap-[16px]">
            <CustomButton
              title="My Posts"
              className="rounded-xl px-5 gap-2"
              textStyle="font-JakartaSemiBold font-normal"
              IconLeft={<EvilIcons name="pencil" size={24} color="white" />}
            />
            <CustomButton
              title="My Favorites"
              IconLeft={<AntDesign name="heart" size={24} color="red" />}
              className="rounded-xl px-5 gap-2 bg-[#F0F8FF]"
              textStyle="font-JakartaSemiBold font-normal"
              textVariant="primary"
            />
          </View>
          <View className="p-4 mt-5">
            <View>
              <InputField
                label="Username"
                placeholder="Edit your name"
                inputStyle="border-2 rounded-xl"
                value={updateData.memberNick}
                onChangeText={(value) =>
                  setUpdateData({ ...updateData, memberNick: value })
                }
              />
            </View>
            <View>
              <InputField
                label="Phone number"
                placeholder="Edit your phone number"
                inputStyle="border-2 rounded-xl"
                value={updateData.memberPhone}
                onChangeText={(value) =>
                  setUpdateData({ ...updateData, memberPhone: value })
                }
              />
            </View>
            <View>
              <InputField
                label="Address"
                placeholder="Edit your address"
                inputStyle="border-2 rounded-xl"
                value={updateData.memberAddress ? updateData.memberAddress : ""}
                onChangeText={(value) =>
                  setUpdateData({ ...updateData, memberAddress: value })
                }
              />
            </View>

            <CustomButton
              title="Update"
              className="rounded-lg bg-black gap-2 mt-7"
              IconLeft={<MaterialIcons name="edit" size={24} color="white" />}
              onPress={updateProfileHandler}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
