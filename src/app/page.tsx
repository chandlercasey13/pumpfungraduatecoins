"use client";


import Link from "next/link";
import BlurFade from "@/components/ui/blur-fade"

export default function Home() {
  return (
    <>
    <BlurFade direction="up">
    <section className="main-content">
      <h1 className="welcome-content-header">What is pump.data?</h1>
      <p className="welcome-content-paragraph">
        <span className="text-blue-400 font-medium">
          Data & Transparency Hub
        </span> for Pump.fun and Similar Platforms. We provide real-time insights and
        analytics to bring clarity to the often opaque world of trading on sites
        like Pump.fun.
      </p>
      <p className="welcome-content-paragraph">
        Our Market Data API delivers key metrics on trading activity, liquidity
        flows, and token performance, helping users make informed decisions. No
        hidden data, no manipulated charts—just raw, transparent information.
      </p>
      <p className="welcome-content-paragraph">
        For those who want deeper insights, our Transaction Tracking Tools allow
        users to monitor wallet movements, detect trends, and analyze the
        mechanics behind price action.
      </p>
      <Link href={'/dashboard'} className="next-button">
       <p>Next</p> 
        <span className="text-blue-400 font-medium">Coin Dashboard</span>
      </Link>


      </section>
      </BlurFade>
    </>
  );
}
