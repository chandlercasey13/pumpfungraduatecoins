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
    To get a transaction for signing and sending with a custom RPC, send a POST request to
    https://pumpportal.fun/api/trade-local
    Your request body must contain the following options:
    publicKey: Your wallet public key
    action: buy or sell
    mint: The contract address of the token you want to trade

      </p>
   <GraphQL/>
   </section>
   </BlurFade>
    </>
)

}