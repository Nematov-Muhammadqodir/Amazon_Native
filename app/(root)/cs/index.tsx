import BlogsLayout from "@/components/layouts/BlogsLayout";
import MenuDropdown from "@/components/MenuDropdown";
import { useNotices } from "@/hooks/useNotices";
import { NoticeFor } from "@/libs/enums/notice.enum";
import { Notice } from "@/types/cs/notice";
import Octicons from "@expo/vector-icons/Octicons";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function CS() {
  const category = Object.values(NoticeFor);

  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  console.log("categoryFilter", categoryFilter);

  const { noticesData, noticesRefetch } = useNotices(
    categoryFilter ? { noticeFor: categoryFilter } : {}
  );

  const [openId, setOpenId] = useState<string | null>(null);

  const toggleItem = (id: string) => {
    if (openId === id) {
      setOpenId(null);
    } else {
      setOpenId(id);
    }
  };

  const notices = noticesData?.getNotices;
  console.log("notices", notices);

  return (
    <BlogsLayout>
      <View className="mb-10">
        <View className="mt-5 px-[25px] flex flex-row justify-between">
          <Text className="text-[20px] font-JakartaExtraBold">
            Frequently Asked Questions
          </Text>

          <MenuDropdown
            options={category.map((category: string) => {
              return {
                text: category,
                onSelect: () => {
                  if (category !== NoticeFor.ALL) {
                    noticesRefetch({
                      input: { noticeFor: category },
                    });
                    setCategoryFilter(category);
                  } else {
                    noticesRefetch({
                      input: {},
                    });
                  }
                },
              };
            })}
          />
        </View>

        {/* FAQ LIST */}
        <View className="mt-6 px-[25px] gap-3">
          {!notices?.length ? (
            <View className="flex-1 justify-center items-center mt-5 gap-2">
              <Octicons name="search" size={44} color="black" />
              <Text className="text-[20px]">
                Ooops no FAQ on {categoryFilter?.toLowerCase()[0].toUpperCase()}
                {categoryFilter?.toLowerCase().slice(1)}
              </Text>
            </View>
          ) : (
            notices?.map((notice: Notice) => {
              const isOpen = openId === notice._id;

              return (
                <View
                  key={notice._id}
                  className="border border-gray-300 rounded-lg"
                >
                  <Pressable
                    onPress={() => toggleItem(notice._id)}
                    className="p-4"
                  >
                    <Text className="font-JakartaBold text-[14px]">
                      {notice.noticeTitle}
                    </Text>
                  </Pressable>

                  {isOpen && (
                    <View className="px-4 pb-4">
                      <Text className="text-[13px] font-JakartaLight text-gray-600">
                        {notice.noticeContent}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>
      </View>
    </BlogsLayout>
  );
}