// Netlify Function v2: 調用 Gemini API 產生金句
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
    return Response.json(
      { error: 'Method not allowed' },
      { status: 405, headers: corsHeaders }
    );
  }

  // 檢查 API Key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: 'API Key 未設定，請到 Netlify Site configuration → Environment variables 設定 GEMINI_API_KEY' },
      { status: 500, headers: corsHeaders }
    );
  }

  // 解析請求
  let imageData, mimeType;
  try {
    const body = await req.json();
    imageData = body.imageData;
    mimeType = body.mimeType || 'image/png';
  } catch (e) {
    return Response.json(
      { error: '請求格式錯誤' },
      { status: 400, headers: corsHeaders }
    );
  }

  if (!imageData) {
    return Response.json(
      { error: '請提供檔案' },
      { status: 400, headers: corsHeaders }
    );
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
        return Response.json(
          { error: errorMsg },
          { status: 500, headers: corsHeaders }
        );
      } catch {
        return Response.json(
          { error: `API 錯誤 ${response.status}` },
          { status: 500, headers: corsHeaders }
        );
      }
    }

    // 解析回應
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response:', responseText.substring(0, 500));
      return Response.json(
        { error: '無法解析 API 回應' },
        { status: 500, headers: corsHeaders }
      );
    }

    // 取得文字內容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error('No text in response:', JSON.stringify(data).substring(0, 500));
      return Response.json(
        { error: 'AI 無法從這張圖產生金句，請換一張試試' },
        { status: 500, headers: corsHeaders }
      );
    }

    // 分割金句
    const quotes = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 5 && line.length < 80);

    if (quotes.length === 0) {
      return Response.json(
        { error: '無法解析金句，請換一張圖試試' },
        { status: 500, headers: corsHeaders }
      );
    }

    return Response.json(
      { quotes },
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Function error:', error);
    return Response.json(
      { error: '伺服器錯誤：' + (error.message || '未知錯誤') },
      { status: 500, headers: corsHeaders }
    );
  }
};
