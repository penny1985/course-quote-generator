// Netlify Function v2: 調用 Gemini API 產生金句

// 相容 Node.js 18+ 的 JSON 回應 helper（不使用 Response.json()）
function jsonResponse(body, status, corsHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export default async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('', { status: 200, headers: corsHeaders });
  }

  // 只接受 POST
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405, corsHeaders);
  }

  // 檢查 API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return jsonResponse(
      { error: 'API Key 未設定，請到 Netlify Site configuration → Environment variables 設定 GEMINI_API_KEY' },
      500, corsHeaders
    );
  }

  // 解析請求
  let imageData, mimeType;
  try {
    const body = await req.json();
    imageData = body.imageData;
    mimeType = body.mimeType || 'image/png';
  } catch (e) {
    return jsonResponse({ error: '請求格式錯誤' }, 400, corsHeaders);
  }

  if (!imageData) {
    return jsonResponse({ error: '請提供檔案' }, 400, corsHeaders);
  }

  // 呼叫 Gemini API
  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: imageData
            }
          },
          {
            text: `你是課程行銷文案專家。請根據這份簡報，產出 6 句課程金句。

要求：
- 每句 15-30 字，有力量感
- 能引發學員共鳴
- 風格混合：激勵、痛點、轉變、好奇
- 避免陳腔濫調

直接輸出 6 句，每句一行，不要編號。`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      }
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error('Gemini API error:', response.status, responseText);
      try {
        const errorData = JSON.parse(responseText);
        const errorMsg = errorData.error?.message || `API 錯誤 ${response.status}`;
        return jsonResponse({ error: errorMsg }, 500, corsHeaders);
      } catch {
        return jsonResponse({ error: `API 錯誤 ${response.status}` }, 500, corsHeaders);
      }
    }

    // 解析回應
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText.substring(0, 500));
      return jsonResponse({ error: '無法解析 API 回應' }, 500, corsHeaders);
    }

    // 取得文字內容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text in response:', JSON.stringify(data).substring(0, 500));
      return jsonResponse({ error: 'AI 無法從這張圖產生金句，請換一張試試' }, 500, corsHeaders);
    }

    // 分割金句
    const quotes = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 5 && line.length < 80);

    if (quotes.length === 0) {
      return jsonResponse({ error: '無法解析金句，請換一張圖試試' }, 500, corsHeaders);
    }

    return jsonResponse({ quotes }, 200, corsHeaders);

  } catch (error) {
    console.error('Function error:', error);
    return jsonResponse(
      { error: '伺服器錯誤：' + (error.message || '未知錯誤') },
      500, corsHeaders
    );
  }
};
