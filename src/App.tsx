import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import service from "./services"

interface ResearchRecommendation {
  url: string;
  title: string;
  summary: string;
}

function App() {
  const [query, setQuery] = useState("");
  const [cards, setCards] = useState<ResearchRecommendation[]>([]);
  const [keyword, setKeyword] = useState("");

  // Fetch recommendations when the component mounts
  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendations = await service.homeRecommendations();
      setCards(recommendations.data);
      setKeyword(recommendations.keyword);
    };

    fetchRecommendations();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100">
      <div className="w-full max-w-2xl mt-40 text-center">
        <h1 className="text-4xl font-semibold text-gray-800">
          Your Research Recommendation
        </h1>

        <p className="mt-2 text-lg text-gray-600">
          Today's keyword is{" "}
          <span className="text-blue-500">{keyword}</span>
        </p>

        <div className="mt-4 flex items-center border border-gray-300 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-l-lg"
          />
          <button className="p-3 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600">
            Search
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-lg text-gray-700">
        Here are some recommendations:
      </div>
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
    </div>
  );
}

export default App;
