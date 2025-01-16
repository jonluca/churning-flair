import Link from "next/link";

import { api } from "~/utils/api";
import { env } from "~/env";

export default function Home() {
  const { data: authData } = api.reddit.getCurrentFlair.useQuery();

  return (
    <>
      <h1 className={"text-2xl font-bold tracking-tight"}>r/{env.NEXT_PUBLIC_REDDIT_SUBREDDIT} flair selector</h1>
      <Link
        className={"flex max-w-xs flex-col gap-4 rounded-xl bg-gray-100 p-4 hover:bg-gray-200"}
        href={authData?.authUrl ?? "#"}
        target={"_blank"}
      >
        <h3 className={"text-2xl font-bold"}>Login →</h3>
      </Link>
    </>
  );
}
