"use client";


import OldComponent from "@/components/oldComponent";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Dashboard() {
  return (
    <>
     
    <section className="flex flex-col w-[calc(100vw-300px)]  h-[calc(100vh-70px)] text-white pt-[30px]  pb-[0px] pl-[60px] overflow-hidden  ">
    <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
    Home    
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbItem>
    Data Analytics   
    </BreadcrumbItem>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Dashboard</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
 
    <OldComponent/>
    </section>
   
    </>
  );
}
