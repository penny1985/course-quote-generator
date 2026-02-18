// Netlify Function: 調用 Gemini API 產生金句
export async function handler(event) {
  // 設定 CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // 處理 OPTIONS 請求
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // 只接受 POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // 解析請求
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '無效的請求格式' })
      };
    }

    const { imageData, mimeType } = requestBody;
    
    if (!imageData) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: '請提供圖片資料' })
      };
    }

    // 檢查 API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'API Key 未設定。請在 Netlify 的 Site configuration → Environment variables 中設定 GEMINI_API_KEY' 
        })
      };
    }

    // 判斷內容類型
    const finalMimeType = mimeType || 'image/png';
    
    // 建立請求內容
    const requestPayload = {
      contents: [{
        parts: [
          {
            inline_data: {
              mime_type: finalMimeType,
              data: imageData
            }
          },
          {
            text: `你是一位專業的課程行銷文案專家。請根據這份簡報內容，產出 6 句課程金句。

要求：
1. 每句金句要能獨立使用，適合放在簡報封面、社群貼文、課程宣傳
2. 金句要有力量感，能引發目標學員的共鳴
3. 長度控制在 15-30 字之間
4. 風格可以混合：有的激勵人心、有的點出痛點、有的強調轉變、有的製造好奇
5. 避免陳腔濫調，要有記憶點

請直接輸出 6 句金句，每句一行，不要編號，不要其他說明文字。`
          }
        ]
      }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 1024,
      }
    };

    // 調用 Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestPayload)
    });

    // 取得回應文字
    const responseText = await response.text();
    
    // 檢查回應狀態
    if (!response.ok) {
      console.error('Gemini API Error Status:', response.status);
      console.error('Gemini API Error Response:', responseText);
      
      let errorMessage = `API 錯誤 (${response.status})`;
      
      try {
        const errorJson = JSON.parse(responseText);
        if (errorJson.error?.message) {
          errorMessage = errorJson.error.message;
        }
      } catch (e) {
        // 無法解析錯誤 JSON
      }
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: errorMessage })
      };
    }

    // 解析 JSON 回應
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Gemini response:', responseText);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '無法解析 API 回應' })
      };
    }

    // 檢查 API 回應是否有錯誤
    if (data.error) {
      console.error('Gemini API Response Error:', data.error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: data.error.message || 'Gemini API 錯誤' })
      };
    }

    // 解析回應內容
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!text) {
      console.error('Empty response from Gemini:', JSON.stringify(data));
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '無法從簡報中產生金句，請嘗試上傳其他圖片' })
      };
    }

    // 分割金句
    const quotes = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length < 100);

    if (quotes.length === 0) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: '無法解析金句，請嘗試上傳其他圖片' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ quotes })
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '伺服器錯誤：' + error.message })
    };
  }
}
