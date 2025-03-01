"use client"

import BlurFade from "@/components/ui/blur-fade"
import CodeEditor from "@/components/CodeEditor"
import { Code } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
export default function Docs() {



return(
    <>
    <BlurFade direction="up">
   <section className="api-tester-main-content">
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
   <h1 className="welcome-content-header"> Getting Started</h1>
   <p className="welcome-content-paragraph">
    To get a transaction for signing and sending with a custom RPC, send a POST request to
    https://pumpportal.fun/api/trade-local
    Your request body must contain the following options:
    publicKey: Your wallet public key
    action: buy or sell
    mint: The contract address of the token you want to trade

      </p>
      <CodeEditor/>
   
   </section>
   </BlurFade>
    </>
)

}