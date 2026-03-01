import { userVar } from "@/apollo/store";
import { CREATE_COMMENT } from "@/apollo/user/mutation";
import { GET_COMMENTS } from "@/apollo/user/query";
import CommentInputBox from "@/components/CommentInputBox";
import CustomButton from "@/components/CustomButton";
import FeaturedProducts from "@/components/FeaturedProducts";
import HorizontalLine from "@/components/HorizontalLine";
import HomeLayout from "@/components/layouts/HomeLayout";
import RatingStars from "@/components/RatingStars";
import TestimonialCard from "@/components/TestimonialCard";
import { images } from "@/constants";
import { useProduct } from "@/hooks/useProduct";
import { CommentGroup } from "@/libs/enums/comment.enum";
import { Message } from "@/libs/enums/common.enum";
import { Comment, Comments } from "@/types/comment/comment";
import { CommentInput, CommentsInquiry } from "@/types/comment/comment.input";
import { REACT_APP_API_URL } from "@/types/config";
import {
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "@/types/sweetAlert";
import { useMutation, useQuery, useReactiveVar } from "@apollo/client/react";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

interface GetComments {
  getComments: Comments;
}

const DEFAULT_COMMENT_INQUIRY: CommentsInquiry = {
  page: 1,
  limit: 5,
  sort: "createdAt",
  direction: "DESC",
  search: {
    commentRefId: "",
  },
};

export default function ProductDetail() {
  //Comments
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.MEMBER,
    commentContent: "",
    commentRefId: "",
  });
  const user = useReactiveVar(userVar);
  const [count, setCount] = useState(0);
  const { id } = useLocalSearchParams<{ id: string }>();
  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(
    DEFAULT_COMMENT_INQUIRY
  );
  const [createComment] = useMutation(CREATE_COMMENT);

  useEffect(() => {
    if (!id) return;
    setCommentInquiry((prev) => ({
      ...prev,
      search: { commentRefId: id },
    }));
    setInsertCommentData({
      ...insertCommentData,
      commentRefId: id as string,
    });
  }, [id]);

  const { getProductLoading, getProductData, getProductError } = useProduct(id);

  const { data: getCommentsData, refetch: getCommentsRefetch } =
    useQuery<GetComments>(GET_COMMENTS, {
      fetchPolicy: "network-only",
      variables: { input: commentInquiry },
      notifyOnNetworkStatusChange: true,
    });

  const commentTotal = getCommentsData?.getComments?.metaCounter[0]?.total ?? 0;
  console.log("commentTotal", commentTotal);

  const comments = getCommentsData?.getComments.list;
  const product = getProductData?.getProduct;
  const [activeImage, setActiveImage] = useState<string>("");

  const createCommentHandler = async () => {
    try {
      console.log("id", id);
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      console.log("user._id", user._id);

      // execute likeTargetProduct Mutation
      console.log("insertCommentData", insertCommentData);
      await createComment({
        variables: {
          input: insertCommentData,
        },
      });
      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      await getCommentsRefetch({ input: commentInquiry });
      if (commentTotal === 0) {
        window.location.reload();
      }

      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("Error, createCommentHandler", err);
      await sweetMixinErrorAlert(err.message).then();
    }
  };

  if (getProductLoading)
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0286FF" />
      </View>
    );

  if (getProductError)
    return Alert.alert(
      "Error",
      "Something went wrong!",
      [{ onPress: () => router.push("/(root)/(tabs)/home") }],
      { cancelable: false }
    );

  if (!product)
    return (
      <View className="flex-1 justify-center items-center">
        <Image source={images.noResult} className="w-[300px] h-[300px]" />
        <Text className="font-JakartaExtraBold text-2xl">
          Oops sorry! No product found!
        </Text>
      </View>
    );

  const imgPath = `${REACT_APP_API_URL}/${product?.productImages[0]}`;
  const productDiscountedPrice =
    Number(product.productPrice) -
    (Number(product.productPrice) * product.productDiscountRate) / 100;

  return (
    <HomeLayout>
      <View className="justify-center items-center mt-5 px-7">
        <Pressable onPress={() => router.back()} className="mb-5 self-start">
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View>
          <View className="w-[335px] border-[1px] border-gray-400 bg-[#DAE9CB] rounded-[10px]">
            <Image
              source={{ uri: activeImage ? activeImage : imgPath }}
              className="self-center w-[155px] h-[195px]"
            />
          </View>
          <View className="flex flex-row flex-nowrap justify-between mt-4">
            {product.productImages.slice(0).map((image) => {
              const smallImagePath = `${REACT_APP_API_URL}/${image}`;
              return (
                <Pressable
                  className="justify-start w-[75px] border-[1px] border-gray-400 rounded-[10px]"
                  key={image}
                  onPress={() =>
                    setActiveImage(`${REACT_APP_API_URL}/${image}`)
                  }
                >
                  <Image
                    source={{ uri: smallImagePath }}
                    className="w-[65px] h-[75px] self-center"
                  />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="self-start mt-10 gap-5">
          <Text className="text-3xl flex overflow-hidden font-JakartaExtraBold">
            {product.productName}
          </Text>
          <Text>{product.productDesc}</Text>
        </View>
        <HorizontalLine />

        <View className="self-start mt-10 gap-5">
          <View className="flex flex-row gap-3 items-center">
            <Text className="text-3xl flex overflow-hidden font-JakartaExtraBold">
              ₩{" "}
              {product.productDiscountRate !== 0
                ? productDiscountedPrice
                : product.productPrice}
            </Text>
            {product.productDiscountRate !== 0 && (
              <Text className="text-2xl text-red-600 line-through flex overflow-hidden font-JakartaExtraBold">
                ₩ {product.productPrice}
              </Text>
            )}
            <RatingStars rating={4} />
          </View>

          <View className="flex flex-row gap-3 items-center">
            <View className="flex flex-row gap-2 items-center">
              <Entypo name="dot-single" size={44} color="#17B63A" />
              <View>
                <Text className="font-JakartaExtraBold color-[#17B63A] text-[20px]">
                  In Stock
                </Text>
                <Text className="color-gray-600 font-JakartaMedium">
                  In stock, ready to be shipped.
                </Text>
              </View>
            </View>
          </View>

          <View className="flex flex-row gap-3 items-center justify-between">
            <View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">Type:</Text>
                <Text>{product.productCollection}</Text>
              </View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Origin price:
                </Text>
                <Text>{product.productOriginPrice}</Text>
              </View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Discound:
                </Text>
                <Text>{product.productDiscountRate}%</Text>
              </View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Left count:
                </Text>
                <Text>{product.productLeftCount}</Text>
              </View>
            </View>
            <View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Origin:
                </Text>
                <Text>{product.productOrigin}</Text>
              </View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Sold count:
                </Text>
                <Text>{product.productSoldCount}</Text>
              </View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Views:
                </Text>
                <Text>{product.productViews}</Text>
              </View>
              <View className="flex flex-row gap-2 items-end">
                <Text className="font-JakartaExtraBold text-[16px]">
                  Volume:
                </Text>
                <Text>{product.productVolume}</Text>
              </View>
            </View>
          </View>
        </View>
        <HorizontalLine />

        <View className="mt-7 flex justify-center items-center w-full">
          <View className="flex flex-row justify-between w-full gap-2">
            <View className="w-[150px] flex flex-row justify-between border-2 items-center px-5 rounded-full border-[#2D4D23]">
              <Pressable onPress={() => setCount((prev) => prev - 1)}>
                <Text className="font-JakartaExtraBold text-[20px]">-</Text>
              </Pressable>
              <Text className="font-JakartaExtraBold text-[20px]">{count}</Text>
              <Pressable onPress={() => setCount((prev) => prev + 1)}>
                <Text className="font-JakartaExtraBold text-[20px]">+</Text>
              </Pressable>
            </View>
            <CustomButton
              title="Add To Cart"
              className="w-[190px] bg-white border-[#2D4D23] border-2"
              textVariant="green"
            />
          </View>
          <CustomButton
            title="BUY IT NOW"
            className="w-[342px] mt-3 bg-[#265B4E]"
          />
        </View>

        <View className="self-start mt-5 flex flex-row items-end gap-2">
          <MaterialIcons name="money-off" size={24} color="black" />
          <Text className="text-[16px] font-JakartaSemiBold">
            Free Return Within 30 Days Of Purchase
          </Text>
        </View>
        <HorizontalLine />

        <View className="my-10">
          <Text className="text-center text-2xl font-JakartaExtraBold mb-3">
            Featured Products
          </Text>
          <FeaturedProducts
            collection={product.productCollection}
            id={product._id}
          />
        </View>
        {comments?.length !== 0 ? <HorizontalLine /> : ""}

        {comments?.length !== 0 ? (
          <View className="mt-20">
            <Text className="text-2xl font-JakartaBold self-center">
              Customer Testimonials
            </Text>
            <View className="mt-3 gap-3">
              {comments?.map((comment: Comment, index) => (
                <View key={index}>
                  <TestimonialCard comment={comment} />
                </View>
              ))}
            </View>
          </View>
        ) : (
          ""
        )}
        <HorizontalLine />
      </View>
      <CommentInputBox
        value={insertCommentData.commentContent}
        onChangeText={(text) =>
          setInsertCommentData((prev) => ({
            ...prev,
            commentContent: text,
          }))
        }
        classname={comments?.length ? "mt-16" : "mt-8"}
        onSubmit={createCommentHandler}
      />
    </HomeLayout>
  );
}
