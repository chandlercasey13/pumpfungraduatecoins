
import BlurFade from "@/components/ui/blur-fade"
import GraphQl from"@/components/GraphiQLTester"


export default function Endpoint() {



return(
    <>
    <BlurFade direction="up">
   <section className="api-tester-main-content">
   <h1 className="welcome-content-header"> API playground</h1>
   <p className="welcome-content-paragraph">
    To get a transaction for signing and sending with a custom RPC, send a POST request to
    https://pumpportal.fun/api/trade-local
    Your request body must contain the following options:
    publicKey: Your wallet public key
    action: buy or sell
    mint: The contract address of the token you want to trade

      </p>
   <GraphQl/>
   </section>
   </BlurFade>
    </>
)

}