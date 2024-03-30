const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

export const getInterest = async (page: number, size: number) => {
    const response = await fetch(`${API_BASE_URL}/api/interest/getInterest?page=${page}&size=${size}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    const responseBody = await response.json();
    const statusCode = response.status;
  
    return { statusCode, responseBody };
};

export const selectInterest = async (selectedInterestId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/interest/selectInterest`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({selectedInterestId}),
    });
  
    const responseBody = await response.json();
    const statusCode = response.status;
  
    return { statusCode, responseBody };
};

export const unselectInterest = async (selectedInterestId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/interest/unselectInterest`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({selectedInterestId}),
    });
  
    const responseBody = await response.json();
    const statusCode = response.status;
  
    return { statusCode, responseBody };
};


  