import BrandSwiper from "@/components/aboutUs/BrandSwiper";
import Experience from "@/components/aboutUs/Experience";
import HowWeWorkBanner from "@/components/aboutUs/HowWeWorkBanner";
import HowWeWorkText from "@/components/aboutUs/HowWeWorkText";
import MissionList from "@/components/aboutUs/MissionList";
import MultipleBanner from "@/components/aboutUs/MultipleBanner";
import OurStories from "@/components/aboutUs/OurStories";
import SmallAboutUsBanner from "@/components/aboutUs/SmallAboutUsBanner";
import HorizontalLine from "@/components/HorizontalLine";
import HomeLayout from "@/components/layouts/HomeLayout";
import React from "react";

export default function AboutUsScreen() {
  return (
    <HomeLayout>
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
    </HomeLayout>
  );
}
