import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

interface ResearchPaper {
  id: string;
  title: string;
  summary: string;
}

interface ResearchRecommendation {
  url: string;
  title: string;
  summary: string;
}

interface FrontendResponse {
    data: ResearchRecommendation[];
    keyword: string;
}

const homeRecommendations = async (): Promise<FrontendResponse> => {
  try {
    const response = await axios.get<{
      status: number;
      message: string;
      data: ResearchPaper[];
      keyword: string;
    }>(`${API_URL}/day_recommendation/`);

    // Extract only required fields
    const filteredData: ResearchRecommendation[] = response.data.data.map(
      (item) => ({
        url: item.id, // Use "id" as the URL
        title: item.title,
        summary: item.summary,
      })
    );

    return {
      data: filteredData,
      keyword: response.data.keyword,
    };

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return {
      data: [],
      keyword: "",
    };
  }
};

export default { homeRecommendations };
