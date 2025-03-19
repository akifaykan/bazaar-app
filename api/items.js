// Edge API proxy for Vercel
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // Fetch data from API
    const apiResponse = await fetch('https://www.howbazaar.gg/api/items');
    
    // Check if API response is successful
    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`);
    }
    
    // Get API response data
    const data = await apiResponse.json();
    
    // Return response with CORS headers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    // Handle errors
    return new Response(
      JSON.stringify({ error: `Error fetching API data: ${error.message}` }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
} 