import { useRouter } from "next/router";
import { useState, useMemo } from "react";
import { api } from "~/utils/api";
import { Virtuoso } from "react-virtuoso";
import Fuse from "fuse.js";
import Link from "next/link";

export default function RedirectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [selectedFlairs, setSelectedFlairs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get flair options
  const { data: flairOptions = [], isLoading } = api.reddit.getFlairOptions.useQuery();
  const { mutate: setFlair, isSuccess } = api.reddit.setUserFlair.useMutation({
    onSuccess: () => {
      setError(null);
      // Show success message or redirect
    },
    onError: (error) => {
      setError(error.message);
    },
  });
  // Setup fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(flairOptions, {
        keys: ["flair"],
        threshold: 0.3,
      }),
    [flairOptions],
  );

  // Filter flairs based on search
  const filteredFlairs = useMemo(() => {
    if (!searchQuery) {
      return flairOptions;
    }
    return fuse.search(searchQuery).map((result) => result.item);
  }, [searchQuery, flairOptions, fuse]);

  // Add preview computation
  const flairPreview = useMemo(() => {
    return selectedFlairs.join(" | ");
  }, [selectedFlairs]);

  const handleFlairSelect = (flairText: string) => {
    setSelectedFlairs((prev) => {
      if (prev.includes(flairText)) {
        return prev.filter((f) => f !== flairText);
      }
      if (prev.length >= 2) {
        return [prev[1]!, flairText];
      }
      return [...prev, flairText];
    });
  };

  const handleSave = () => {
    if (selectedFlairs.length === 0) {
      setError("Please select at least one flair");
      return;
    }

    setFlair({
      code: router.query.code as string,
      state: router.query.state as string,
      flairText: selectedFlairs,
    });
  };

  // Render individual flair item
  const FlairItem = ({ flair }: { flair: { flair: string } }) => (
    <label className={"flex cursor-pointer items-center p-2 hover:bg-gray-100"}>
      <input
        type={"checkbox"}
        name={"flair"}
        value={flair.flair}
        checked={selectedFlairs.includes(flair.flair)}
        onChange={() => handleFlairSelect(flair.flair)}
        className={"mr-2"}
      />
      <span className={"truncate"}>{flair.flair}</span>
    </label>
  );

  if (isSuccess) {
    return (
      <div className={"mx-auto max-w-md p-4"}>
        <h1 className={"mb-4 text-2xl font-bold"}>Success! Your flair is now</h1>
        <div className={"mb-4 rounded border border-gray-200 bg-gray-50 p-3"}>{flairPreview}</div>
        <Link href={"/"}>
          <button className={"rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"}>Home</button>
        </Link>
      </div>
    );
  }
  return (
    <div className={"mx-auto max-w-md p-4"}>
      <h1 className={"mb-4 text-2xl font-bold"}>Set Your Flair</h1>

      {error ? (
        <div className={"mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"}>{error}</div>
      ) : (
        <>
          <div className={"mb-4"}>
            <label className={"mb-2 block text-sm font-medium"}>Search Flairs</label>
            {isLoading && <div>Loading...</div>}
            <input
              type={"text"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={"mb-2 w-full rounded border p-2"}
              placeholder={"Search flairs..."}
            />

            <div className={"h-[400px] rounded border"}>
              <Virtuoso data={filteredFlairs} itemContent={(index, flair) => <FlairItem flair={flair} />} className={"h-full"} />
            </div>
          </div>

          {/* Add preview section */}
          {selectedFlairs.length > 0 && (
            <div className={"mb-4 rounded border border-gray-200 bg-gray-50 p-3"}>
              <div className={"text-sm font-medium text-gray-600"}>Preview:</div>
              <div className={"mt-1"}>{flairPreview}</div>
            </div>
          )}

          <div className={"flex flex-col items-center justify-between"}>
            <div className={"text-sm text-gray-600"}>{selectedFlairs.length}/2 selected</div>
            <button onClick={handleSave} className={"rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"}>
              Save Flair
            </button>
          </div>
        </>
      )}
    </div>
  );
}
