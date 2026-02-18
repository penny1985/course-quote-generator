// Netlify Function: 調用 Gemini API 產生金句
export async function handler(event) {
  // 只接受 POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { imageData, mimeType } = JSON.parse(event.body);
    
    if (!imageData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: '請提供圖片資料' })
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API Key 未設定' })
      };
    }

    // 調用 Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType || 'image/png',
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

請直接輸出 6 句金句，每句一行，不要編號，不要其他說明。`
              }
            ]
          }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 1024,
          }
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error.message })
      };
    }

    // 解析回應
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const quotes = text.split('\n').filter(line => line.trim().length > 0);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quotes })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
