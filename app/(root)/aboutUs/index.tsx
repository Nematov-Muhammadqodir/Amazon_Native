import BrandSwiper from "@/components/aboutUs/BrandSwiper";
import Experience from "@/components/aboutUs/Experience";
import HowWeWorkBanner from "@/components/aboutUs/HowWeWorkBanner";
import HowWeWorkText from "@/components/aboutUs/HowWeWorkText";
import MissionList from "@/components/aboutUs/MissionList";
import MultipleBanner from "@/components/aboutUs/MultipleBanner";
import OurStories from "@/components/aboutUs/OurStories";
import SmallAboutUsBanner from "@/components/aboutUs/SmallAboutUsBanner";
import HorizontalLine from "@/components/HorizontalLine";
import BlogsLayout from "@/components/layouts/BlogsLayout";
import React from "react";
import { View } from "react-native";

export default function AboutUsScreen() {
  return (
    <BlogsLayout>
      <View>
        <SmallAboutUsBanner key={"SmallAboutUsBanner"} />
        <OurStories key={"OurStories"} />
        <MultipleBanner key={"MultipleBanner"} />
        <MissionList key={"MissionList"} />
        <HowWeWorkBanner key={"HowWeWorkBanner"} />
        <HorizontalLine />
        <HowWeWorkText key={"HowWeWorkText"} />
        <Experience />
        <HorizontalLine />
        <BrandSwiper />
      </View>
    </BlogsLayout>
  );
}
