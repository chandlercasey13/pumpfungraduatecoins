"use client"
import dynamic from "next/dynamic";
import BlurFade from "@/components/ui/blur-fade"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Endpoint() {

const GraphQL = dynamic(() => import("@/components/GraphiQLTester"), { ssr: false });


return(
    <>
    <BlurFade direction="up">
   <section className="api-tester-main-content">
   <Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
{"Home"}    
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      
    {"Data Analytics"}   
  
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>{"Dashboard"}</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
   <h1 className="welcome-content-header"> API playground</h1>
   <p className="welcome-content-paragraph">
   Experiment with API requests in real time. Run queries, inspect responses, and test different parameters to understand how the system works. Use this playground to explore data, simulate trades, and refine your API usage effectively.

      </p>
   <GraphQL/>
   </section>
   </BlurFade>
    </>
)

}