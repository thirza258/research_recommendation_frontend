import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

interface ResearchPaper {
  id: string;
  title: string;
  summary: string;
}

interface ArrayResearchPaper {
  response: ResearchPaper[];
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

interface SearchRequest {
  search_request: string;
}

interface APIResponse {
  status: number;
  message: string;
  data: ArrayResearchPaper;
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

const searchRecommendations = async (search_request: SearchRequest): Promise<FrontendResponse> => {
  try {
    const response = await axios.post<APIResponse>(
      `${API_URL}/research_recommendation/`, 
      search_request, 
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    if (response.data.status !== 200) {
      throw new Error(`API Error: ${response.data.message}`);
    }

    // Ensure response.data.data.response is an array before using .map()
    if (!response.data.data || !Array.isArray(response.data.data.response)) {
      throw new Error("Unexpected API response format: 'data.response' is not an array.");
    }

    const filteredData: ResearchRecommendation[] = response.data.data.response.map((item) => ({
      url: item.id, // Using 'url' directly instead of 'id'
      title: item.title,
      summary: item.summary,
    }));

    return {
      data: filteredData,
      keyword: response.data.keyword || "",
    };

  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return {
      data: [],
      keyword: "",
    };
  }
};


export default { homeRecommendations, searchRecommendations };
