import Link from "next/link";

import { api } from "~/utils/api";

export default function Home() {
  const { data: authData } = api.reddit.getCurrentFlair.useQuery();

  return (
    <>
      <h1 className={"text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]"}>r/churning flair selector</h1>
      <div className={"grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8"}>
        <Link
          className={"flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"}
          href={authData?.authUrl ?? "#"}
          target={"_blank"}
        >
          <h3 className={"text-2xl font-bold"}>Login →</h3>
        </Link>
      </div>
    </>
  );
}
