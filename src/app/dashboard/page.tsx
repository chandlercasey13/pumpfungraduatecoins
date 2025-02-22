"use client";

import { useEffect, useState } from "react";
import OldComponent from "@/components/oldComponent";

export default function Dashboard() {
  return (
    <>
    <section className="flex flex-col w-[calc(100vw-300px)] text-white pt-[10px]  pb-[0px] pl-[60px] ">
   
    <OldComponent/>
    </section>
    
    </>
  );
}
