// Edge API proxy for Vercel
export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  try {
    // API'den veriyi çek
    const apiResponse = await fetch('https://www.howbazaar.gg/api/items');
    
    // API yanıtının başarılı olduğunu kontrol et
    if (!apiResponse.ok) {
      throw new Error(`API error: ${apiResponse.status}`);
    }
    
    // API yanıtını al
    const data = await apiResponse.json();
    
    // CORS başlıkları ekleyerek yanıt döndür
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
    // Hata durumunda
    return new Response(
      JSON.stringify({ error: `API veri çekme hatası: ${error.message}` }),
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