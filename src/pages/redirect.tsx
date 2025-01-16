import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export default function RedirectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { mutate: setFlair } = api.reddit.setUserFlair.useMutation({
    onSuccess: () => {
      // Handle success (e.g., show a success message)
    },
    onError: (error) => {
      setError(error.message);
    },
  });

  const { data: oauthData } = api.reddit.oauthCallback.useQuery(
    {
      code: router.query.code as string,
      state: router.query.state as string,
    },
    {
      enabled: !!router.query.code && !!router.query.state,
    },
  );

  useEffect(() => {
    if (oauthData) {
      setFlair({
        accessToken: oauthData.accessToken,
        flairText: "Your flair text", // You might want to make this configurable
      });
    }
  }, [oauthData, setFlair]);

  return <div>{error ? <p>Error: {error}</p> : <p>Setting your flair...</p>}</div>;
}
