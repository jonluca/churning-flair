import { Poppins } from "next/font/google";
import { type AppType } from "next/app";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import dynamic from "next/dynamic";
import Head from "next/head";
import { env } from "~/env";

const ReactQueryDevtools = dynamic(() => import("@tanstack/react-query-devtools").then((module) => module.ReactQueryDevtools), {
  ssr: false,
});

export const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "fallback",
  fallback: ["sans-serif"],
  variable: "--font-poppins",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>r/{env.NEXT_PUBLIC_REDDIT_SUBREDDIT} flair selector</title>
        <meta name={"description"} content={`r/${env.NEXT_PUBLIC_REDDIT_SUBREDDIT} flair selector`} />
        <link rel={"icon"} href={"/favicon.ico"} />
      </Head>
      <div className={poppins.className}>
        <main className={"flex min-h-screen flex-col items-center justify-center bg-white"}>
          <div className={"container flex flex-col items-center justify-center gap-12 px-4 py-16"}>
            <Component {...pageProps} />
          </div>
        </main>
        <ReactQueryDevtools />
      </div>
    </>
  );
};

export default api.withTRPC(MyApp);
