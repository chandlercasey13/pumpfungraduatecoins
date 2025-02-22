"use client";


import OldComponent from "@/components/oldComponent";
import BlurFade from "@/components/ui/blur-fade";
export default function Dashboard() {
  return (
    <>
     <BlurFade
        direction="up"
        className="  md:overflow-hidden"
      >
    <section className="flex flex-col w-[calc(100vw-300px)] text-white pt-[10px]  pb-[0px] pl-[50px] ">
   
    <OldComponent/>
    </section>
    </BlurFade>
    </>
  );
}
