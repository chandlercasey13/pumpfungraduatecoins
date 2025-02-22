"use client";


import styles from "./styles.module.css"
import Link from "next/link";

export default function Home() {
  return (
    <>
    <section className={styles["main-content"]}>
      <h1 className={styles["welcome-content-header"]}>What is PumpData?</h1>
      <p className={styles["welcome-content-paragraph"]}>
        <span className="text-blue-400 font-medium">
          Data & Transparency Hub
        </span> for Pump.fun and Similar Platforms. We provide real-time insights and
        analytics to bring clarity to the often opaque world of trading on sites
        like Pump.fun.
      </p>
      <p className={styles["welcome-content-paragraph"]}>
        Our Market Data API delivers key metrics on trading activity, liquidity
        flows, and token performance, helping users make informed decisions. No
        hidden data, no manipulated charts—just raw, transparent information.
      </p>
      <p className={styles["welcome-content-paragraph"]}>
        For those who want deeper insights, our Transaction Tracking Tools allow
        users to monitor wallet movements, detect trends, and analyze the
        mechanics behind price action.
      </p>
      <Link href={'/dashboard'} className={styles["next-button"]}>
       <p>Next</p> 
        <span className="text-blue-400 font-medium">Coin Dashboard</span>
      </Link>


      </section>
    </>
  );
}
