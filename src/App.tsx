import { useEffect, useState } from "react";
import service from "./services";

interface ResearchRecommendation {
  url: string;
  title: string;
  summary: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<ResearchRecommendation[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDailyRecommendations = async () => {
      try {
        setLoading(true);
        const recommendations = await service.homeRecommendations();
        setCards(recommendations.data);
        setKeyword(recommendations.keyword);
      } catch (err) {
        setError("Failed to load recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyRecommendations();
  }, []);

  // Handle search request
  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty search

    try {
      setLoading(true);
      setError("");
      const recommendations = await service.searchRecommendations({
        search_request: query,
      });
      setCards(recommendations.data);
      setKeyword(recommendations.keyword);
    } catch (err) {
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-2xl mt-40 text-center">
        <h1 className="text-4xl font-semibold text-gray-800">
          Your Research Recommendation
        </h1>

        {error && <p className="mt-2 text-red-500">{error}</p>}

        <p className="mt-2 text-lg text-gray-600">
          Today's keyword is{" "}
          <span className="text-blue-500">{keyword || "Loading..."}</span>
        </p>

        <div className="mt-4 flex items-center border border-gray-300 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
          />
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-lg text-gray-700">Loading recommendations...</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 w-full max-w-4xl mb-40">
          {cards.map((card, index) => (
            <a
              key={index}
              href={card.url}
              className="p-4 bg-white shadow-lg rounded-2xl border border-gray-200 cursor-pointer hover:shadow-xl transition block"
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {card.title}
              </h3>
              <p className="mt-2 text-gray-600">{card.summary}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
