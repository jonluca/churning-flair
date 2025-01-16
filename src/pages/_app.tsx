import { Poppins } from "next/font/google";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

export const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "fallback",
  fallback: ["sans-serif"],
  variable: "--font-poppins",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div className={poppins.className}>
      <Component {...pageProps} />
    </div>
  );
};

export default api.withTRPC(MyApp);
