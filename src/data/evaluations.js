// AI 工具定義（2026 年 2 月最新）
export const tools = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    company: 'OpenAI',
    models: 'GPT-5.2 Instant · Thinking · Pro',
    color: '#10a37f',
    letter: 'G',
    description: '全能型 AI 助手，多模態生態系最完整。原生圖片生成、Sora 2 影片（最長 60 秒）、Advanced Voice 語音模式、Custom GPTs 與記憶功能。',
    pricing: '免費 / Plus $20/月 / Pro $200/月',
    features: ['Custom GPTs 個人化助手', '原生圖片生成（取代 DALL-E）', 'Sora 2 影片生成', 'Advanced Voice 語音模式', 'Deep Research 深度研究'],
  },
  {
    id: 'claude',
    name: 'Claude',
    company: 'Anthropic',
    models: 'Opus 4.6 · Sonnet 4.6 · Haiku',
    color: '#d4a574',
    letter: 'C',
    description: '長篇寫作與深度思考之王。200K 上下文（1M beta）、128K 最大輸出、Artifacts 即時預覽、Projects 專案管理。以細膩、精準著稱。',
    pricing: '免費 / Pro $20/月 / Team $25/人/月',
    features: ['200K 上下文（1M beta）', 'Artifacts 即時預覽', 'Projects 專案管理', '128K 超長輸出', '自適應思考模式'],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    company: 'Google',
    models: 'Gemini 3.1 Pro · 3 Flash',
    color: '#4285f4',
    letter: 'G',
    description: 'Google 生態系深度整合王者。Workspace 全面嵌入、Veo 3.1 影片（最高 4K）、NotebookLM 知識管理、Gemini Live 語音互動。',
    pricing: '免費 / AI Pro $19.99/月 / Ultra ~$42/月',
    features: ['Google Workspace 全面整合', 'NotebookLM 知識管理', 'Veo 3.1 影片生成（4K）', 'Gemini Live 語音互動', '1M 超長上下文'],
  },
  {
    id: 'grok',
    name: 'Grok',
    company: 'xAI',
    models: 'Grok 4.1 · Grok 4',
    color: '#1da1f2',
    letter: 'X',
    description: '即時資訊與社群洞察專家。原生 X/Twitter 數據、Aurora 圖片、Grok Imagine 影片（含音訊同步）。風格直白、2M 超長上下文。',
    pricing: 'SuperGrok $30/月 / X Premium+ $40/月',
    features: ['X/Twitter 即時數據', 'Aurora 圖片生成', 'Grok Imagine 影片+音訊', '2M 超長上下文', '最低 API 價格'],
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    company: 'Perplexity AI',
    models: 'Sonar Pro · Deep Research',
    color: '#20b2aa',
    letter: 'P',
    description: '搜尋優先的研究型 AI。每個回答附帶引用來源，Deep Research 深度研究報告，教育方案 $10/月。學術級查證首選。',
    pricing: '免費 / Pro $20/月 / 教育 $10/月',
    features: ['即時搜尋附引用來源', 'Deep Research 深度研究', '教育方案特惠', '多模型切換（GPT-5.2/Claude/Gemini）', 'Learning Mode 互動學習'],
  },
  {
    id: 'copilot',
    name: 'Copilot',
    company: 'Microsoft',
    models: 'Anthropic 模型 · GPT-5.2',
    color: '#0078d4',
    letter: 'M',
    description: 'Microsoft 365 原生整合王者。Agent Mode 一句話生成文件/簡報/試算表，Work IQ 記憶你的風格，Outlook 語音助手。',
    pricing: '含 M365 / Copilot $18-21/人/月',
    features: ['Agent Mode 自動生成文件', 'PowerPoint 智慧簡報', 'Excel 數據分析', 'Outlook 語音信件助手', 'Work IQ 個人化記憶'],
  },
];

// 14 個職業講師工作流程及對應評測
export const workflows = [
  {
    id: 'course-design',
    number: '01',
    name: '課程設計與大綱規劃',
    description: '從零到一設計課程架構、學習目標、單元規劃與教學策略。需要系統性思維和對目標學員的深度理解。',
    recommend: 'claude',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: '多元角色扮演能力出色，可用 Custom GPTs 建立專屬課程設計助手。擅長腦力激盪與創意發想。',
        highlight: '建立「課程設計顧問」GPT，輸入目標學員背景即可生成完整大綱',
      },
      claude: {
        rating: 5,
        summary: '超長上下文理解力無人能敵，能同時消化大量參考資料後產出系統性課程架構。邏輯嚴謹且層次分明。',
        highlight: '上傳過去所有教材，Claude 能統整出最佳課程脈絡',
      },
      gemini: {
        rating: 4,
        summary: '可結合 Google 搜尋即時趨勢，NotebookLM 整理研究資料。對已有 Google 生態系的講師特別方便。',
        highlight: '用 NotebookLM 彙整產業報告，再請 Gemini 設計課程架構',
      },
      grok: {
        rating: 3.5,
        summary: '即時趨勢分析有助於了解市場需求和熱門話題，但在結構化課程規劃方面表現一般。',
        highlight: '快速掌握產業最新話題，確保課程內容跟上趨勢',
      },
      perplexity: {
        rating: 4.5,
        summary: '研究型課程設計的最佳選擇。每個建議都附帶學術或產業來源，確保課程內容有據可查。',
        highlight: '課程內容需要引用數據時，Perplexity 提供最可靠的來源',
      },
      copilot: {
        rating: 3.5,
        summary: '與 Word 整合方便直接在文件中規劃，但在課程設計專業度和創意性方面不如其他工具。',
        highlight: '直接在 Word 裡完成大綱，格式排版一步到位',
      },
    },
  },
  {
    id: 'presentation',
    number: '02',
    name: '簡報與教材製作',
    description: '設計教學簡報、講義、學習手冊等視覺化教材。需要兼顧內容品質與視覺美感。',
    recommend: 'copilot',
    evaluations: {
      chatgpt: {
        rating: 4,
        summary: '可生成結構完整的簡報內容，搭配 DALL-E 製作插圖和圖解。適合需要客製化圖片的講師。',
        highlight: '請 ChatGPT 同時寫內容和生成配圖，一站完成',
      },
      claude: {
        rating: 4,
        summary: '優秀的內容組織與層次安排能力，Artifacts 可即時預覽 HTML 簡報。但缺乏圖片生成。',
        highlight: '用 Artifacts 即時預覽簡報排版效果',
      },
      gemini: {
        rating: 4.5,
        summary: '原生 Google Slides 整合，可直接在 Workspace 內生成和編輯簡報。與 Google 生態系無縫銜接。',
        highlight: '一句話就能在 Google Slides 中生成完整簡報',
      },
      grok: {
        rating: 3,
        summary: '缺乏生產力工具整合，簡報製作功能有限。主要適合提供內容靈感和文案建議。',
        highlight: '適合快速產生簡報中的金句和標題文案',
      },
      perplexity: {
        rating: 2.5,
        summary: '以搜尋和研究為主，不適合視覺化教材的製作型任務。但可用於教材內容的資料蒐集。',
        highlight: '作為教材內容的事實查核工具',
      },
      copilot: {
        rating: 5,
        summary: 'PowerPoint 原生 AI 整合 + Designer 自動美化。從大綱到完成簡報一氣呵成，是簡報製作的絕對首選。',
        highlight: '輸入主題，Copilot 自動生成簡報並用 Designer 美化',
      },
    },
  },
  {
    id: 'script-writing',
    number: '03',
    name: '講稿撰寫與備課',
    description: '撰寫完整講課稿、演練口語表達、準備案例故事與臨場應變策略。',
    recommend: 'claude',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: '自然口語化寫作能力強，能模擬不同講課風格（幽默、嚴謹、故事型）。語音模式可用於演練。',
        highlight: '用語音模式模擬 Q&A，練習即時回應',
      },
      claude: {
        rating: 5,
        summary: '長篇寫作之王。語氣一致性極佳，能維持整場 3 小時講稿的風格統一。最懂「講師的語感」。',
        highlight: '一次生成完整 3 小時講稿，語氣從頭到尾一致',
      },
      gemini: {
        rating: 4,
        summary: '可分析影片和音訊參考材料（如過去的上課錄影），幫助改進講課方式。多模態備課能力佳。',
        highlight: '上傳過去的上課錄影，讓 Gemini 分析並建議改進',
      },
      grok: {
        rating: 3.5,
        summary: '寫作品質中等，但在即時案例蒐集方面有優勢。適合準備需要最新時事案例的講稿。',
        highlight: '快速找到最新時事案例融入講稿',
      },
      perplexity: {
        rating: 3,
        summary: '研究取向而非創作型工具。適合為講稿中的論述找到支持性的數據和來源。',
        highlight: '為講稿中的每個論點找到權威引用來源',
      },
      copilot: {
        rating: 3.5,
        summary: '基礎寫作輔助功能，在 Word 中可以協助修改和潤飾講稿。但創作深度不如 Claude 和 ChatGPT。',
        highlight: '在 Word 中直接請 Copilot 修改特定段落語氣',
      },
    },
  },
  {
    id: 'marketing',
    number: '04',
    name: '行銷文案與招生宣傳',
    description: '撰寫課程銷售頁、廣告文案、EDM、招生資訊，以及各種轉換導向的行銷內容。',
    recommend: 'chatgpt',
    evaluations: {
      chatgpt: {
        rating: 5,
        summary: '行銷文案首選。風格多變、說服力強，從 FB 廣告到長篇銷售頁都游刃有餘。配合 DALL-E 可圖文並茂。',
        highlight: '一次生成 10 種不同風格的招生文案 A/B 測試',
      },
      claude: {
        rating: 4.5,
        summary: '優雅品牌文案的最佳選擇，特別適合高端定位的講師。措辭精準、不浮誇、有質感。',
        highlight: '打造一致性高的個人品牌文案系統',
      },
      gemini: {
        rating: 4,
        summary: '可搭配 Google Ads 優化廣告文案，與 Google 廣告生態系整合。適合已經在投放 Google 廣告的講師。',
        highlight: '直接用 Gemini 優化 Google Ads 廣告文案與關鍵字',
      },
      grok: {
        rating: 4,
        summary: '善用即時趨勢寫出話題性文案。風格直白有力，適合想要打破框架的行銷策略。',
        highlight: '結合即時話題寫出引爆社群的招生文案',
      },
      perplexity: {
        rating: 3,
        summary: '不適合行銷創作，但可用於競品分析和市場調研，為行銷策略提供數據支持。',
        highlight: '分析競爭講師的課程定價和行銷策略',
      },
      copilot: {
        rating: 3.5,
        summary: '提供基礎行銷範本，在 Word 中可協助文案撰寫。但行銷專業度和創意性不如 ChatGPT。',
        highlight: '用 Word 範本快速產出基礎行銷文件',
      },
    },
  },
  {
    id: 'social-media',
    number: '05',
    name: '社群經營與個人品牌',
    description: '經營 Facebook、Instagram、YouTube、LinkedIn 等平台，建立個人品牌形象與持續影響力。',
    recommend: 'grok',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: '全平台內容創作能力最全面。IG 短文、FB 長文、LinkedIn 專業文、YouTube 腳本都能處理。',
        highlight: '一個主題同時生成 4 個平台的社群貼文',
      },
      claude: {
        rating: 4,
        summary: '品牌一致性維護最佳。適合產出深度思考型內容，建立「有料」的專業形象。',
        highlight: '用 Projects 管理品牌風格指南，所有貼文風格統一',
      },
      gemini: {
        rating: 4.5,
        summary: 'YouTube 創作者工具深度整合，可分析頻道數據、優化標題和描述。Google 生態系社群經營利器。',
        highlight: '用 Gemini 分析 YouTube 數據，優化影片策略',
      },
      grok: {
        rating: 5,
        summary: 'X/Twitter 原生整合，即時追蹤社群話題和趨勢。最快掌握社群脈動，產出引爆討論的內容。',
        highlight: '即時掌握 X 上的熱門話題，搶先發布相關內容',
      },
      perplexity: {
        rating: 3,
        summary: '可用於話題研究和趨勢分析，但非社群內容創作工具。適合做社群策略的前期調研。',
        highlight: '研究目前社群上的熱門議題和討論方向',
      },
      copilot: {
        rating: 3.5,
        summary: 'LinkedIn 整合較佳，適合經營 B2B 專業社群。但在其他社群平台的支援度有限。',
        highlight: '用 Copilot 撰寫和優化 LinkedIn 專業貼文',
      },
    },
  },
  {
    id: 'graphic-design',
    number: '06',
    name: '圖文與海報設計',
    description: '製作社群圖卡、課程海報、宣傳素材、教學圖解等視覺內容。',
    recommend: 'chatgpt',
    evaluations: {
      chatgpt: {
        rating: 5,
        summary: 'GPT-5.2 原生圖片生成品質最高，支援精確文字排版、透明背景和自訂色彩。能理解複雜指令，產出專業級視覺素材。',
        highlight: '描述課程主題，直接生成社群圖卡和海報設計',
      },
      claude: {
        rating: 2,
        summary: '無原生圖片生成能力，僅能用 SVG/HTML 製作簡單圖表。文字設計建議很優秀但無法執行。',
        highlight: '請 Claude 用 Artifacts 生成 SVG 資訊圖表',
      },
      gemini: {
        rating: 4.5,
        summary: 'Imagen 3 圖片生成品質優異，風格多元。與 Google Slides 整合可直接插入教材。',
        highlight: '用 Imagen 3 生成教學插圖，直接放入 Google Slides',
      },
      grok: {
        rating: 4,
        summary: 'Aurora 圖片生成能力不錯，特別是人物肖像和藝術風格。生成速度快。',
        highlight: '用 Aurora 快速生成課程宣傳用的藝術風格圖片',
      },
      perplexity: {
        rating: 1.5,
        summary: '無圖片生成功能，不適合任何設計相關任務。',
        highlight: '不建議用於此流程',
      },
      copilot: {
        rating: 4.5,
        summary: 'Designer 工具搭配 DALL-E，可直接製作社群圖卡、海報等行銷素材。模板豐富且專業。',
        highlight: '用 Designer 從模板快速產出專業社群圖卡',
      },
    },
  },
  {
    id: 'video-production',
    number: '07',
    name: '影片製作與剪輯',
    description: '製作課程預告片、教學影片、短影音、Reels、線上課程影片等視覺動態內容。',
    recommend: 'gemini',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: 'Sora 2 可生成最長 60 秒的 1080p 影片，支援對話式參數調整。腳本撰寫能力也很強。',
        highlight: '用 Sora 2 生成課程預告短影片，搭配 ChatGPT 寫腳本',
      },
      claude: {
        rating: 2,
        summary: '無影片生成能力。僅能協助撰寫影片腳本、分鏡表和剪輯建議。文字企劃能力優秀。',
        highlight: '請 Claude 撰寫詳細的影片分鏡腳本',
      },
      gemini: {
        rating: 5,
        summary: 'Veo 3.1 可生成最高 4K 畫質影片（含原生音訊），Google Vids 支援 AI 虛擬人物。YouTube 整合最強。',
        highlight: 'Veo 3.1 生成 4K 影片 + Google Vids 製作含 AI 虛擬講師的教學影片',
      },
      grok: {
        rating: 3.5,
        summary: 'Grok Imagine 可生成 6-15 秒含原生音訊的動畫影片，支援唇形同步。但專業度仍不如 Gemini 和 ChatGPT。',
        highlight: '用 Grok Imagine 快速生成含配音的短動畫片段',
      },
      perplexity: {
        rating: 1.5,
        summary: '無影片相關功能。不適合影片製作流程。',
        highlight: '不建議用於此流程',
      },
      copilot: {
        rating: 3.5,
        summary: 'Clipchamp 整合提供基礎影片剪輯功能。適合簡單的教學影片製作，但專業度有限。',
        highlight: '用 Clipchamp 快速剪輯教學影片',
      },
    },
  },
  {
    id: 'classroom-interaction',
    number: '08',
    name: '課堂互動與即時回饋',
    description: '課堂上的即時問答、互動活動設計、即時投票、學員提問回應、分組討論引導。',
    recommend: 'gemini',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: 'Custom GPTs 可建立互動問答機器人，語音模式可做即時對話練習。記憶功能追蹤學員進度。',
        highlight: '建立課程專屬 GPT 讓學員課堂中即時提問',
      },
      claude: {
        rating: 4,
        summary: '即時分析和回饋能力佳，擅長給出結構化且有建設性的回應。但缺乏語音互動模式。',
        highlight: '即時分析學員提問，生成結構化的回覆建議',
      },
      gemini: {
        rating: 5,
        summary: 'Live API 支援即時多模態互動，可分析課堂畫面、語音。與 Google Meet/Forms 整合做即時投票。',
        highlight: '用 Google Forms + Gemini 做即時投票並自動分析結果',
      },
      grok: {
        rating: 3.5,
        summary: '基本互動能力，缺乏即時多模態功能。適合課堂中快速搜尋即時資訊回答學員問題。',
        highlight: '課堂中即時搜尋最新資訊回答學員提問',
      },
      perplexity: {
        rating: 3,
        summary: '可做即時查詢回答學員疑問，附帶來源增加可信度。但互動功能有限。',
        highlight: '學員提問時，用 Perplexity 搜尋附帶來源的回答',
      },
      copilot: {
        rating: 4,
        summary: 'Teams 整合適合線上課程互動，可做會議摘要和即時翻譯。實體課堂支援度有限。',
        highlight: '線上課程用 Teams + Copilot 自動整理 Q&A 摘要',
      },
    },
  },
  {
    id: 'grading',
    number: '09',
    name: '課後作業批改與回饋',
    description: '批改學員作業、提供個人化回饋、追蹤學習進度、設計評量標準。',
    recommend: 'claude',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: '可建立自訂批改 rubric 和評分標準。回饋詳細具體，語氣可調整。',
        highlight: '建立批改 GPT，上傳作業自動依 rubric 評分並給回饋',
      },
      claude: {
        rating: 5,
        summary: '細緻建設性回饋之王。語氣溫暖而專業，能指出問題同時鼓勵學員。最像資深講師的回饋風格。',
        highlight: '批改文字最有溫度，學員不會感覺被 AI 批改',
      },
      gemini: {
        rating: 4,
        summary: '可分析多種格式的作業附件（文件、圖片、影片）。Google Classroom 整合方便。',
        highlight: '整合 Google Classroom，批量批改作業',
      },
      grok: {
        rating: 3,
        summary: '基本批改能力，但回饋品質和溫度不如 Claude 和 ChatGPT。不建議作為主要批改工具。',
        highlight: '適合快速檢查事實性答案的對錯',
      },
      perplexity: {
        rating: 2.5,
        summary: '不適合批改型任務，但可用於查證學員引用的資料是否正確。',
        highlight: '查證學員作業中的引用和數據來源',
      },
      copilot: {
        rating: 3.5,
        summary: 'Word 中可協助修改和批註，但批改深度和個人化程度有限。',
        highlight: '在 Word 中直接加入修改建議和批註',
      },
    },
  },
  {
    id: 'crm',
    number: '10',
    name: '學員管理與 CRM',
    description: '管理學員名單、追蹤報名狀態、維繫學員關係、建立回訓機制與客戶關係管理。',
    recommend: 'copilot',
    evaluations: {
      chatgpt: {
        rating: 3.5,
        summary: 'API 可串接 CRM 系統，Code Interpreter 可分析學員數據。但缺乏原生 CRM 整合。',
        highlight: '用 Code Interpreter 分析學員報名數據和趨勢',
      },
      claude: {
        rating: 3.5,
        summary: '分析學員數據和溝通策略能力佳，但缺乏工具整合。適合規劃 CRM 策略。',
        highlight: '請 Claude 規劃完整的學員關係經營策略',
      },
      gemini: {
        rating: 4.5,
        summary: 'Google Workspace 原生整合（Sheets、Forms、Calendar），可建立輕量級學員管理系統。',
        highlight: '用 Sheets + Forms + Gemini 建立自動化學員管理流程',
      },
      grok: {
        rating: 2.5,
        summary: '缺乏 CRM 相關功能和工具整合。不適合學員管理用途。',
        highlight: '不建議用於此流程',
      },
      perplexity: {
        rating: 2,
        summary: '無 CRM 相關功能。不適合管理型任務。',
        highlight: '不建議用於此流程',
      },
      copilot: {
        rating: 5,
        summary: 'Dynamics 365 / Microsoft 365 原生 CRM 整合。從聯絡人管理到自動化行銷郵件，企業級完整方案。',
        highlight: '用 Dynamics 365 + Copilot 建立專業級學員 CRM 系統',
      },
    },
  },
  {
    id: 'monetization',
    number: '11',
    name: '知識變現（電子書/線上課程）',
    description: '將知識轉化為電子書、線上課程、付費訂閱內容等可規模化的被動收入產品。',
    recommend: 'claude',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: '全方位內容創作，從課程腳本到配圖、行銷文案一站搞定。Custom GPTs 可建立專屬寫作助手。',
        highlight: '用一個 Custom GPT 管理整本電子書的寫作進度',
      },
      claude: {
        rating: 5,
        summary: '長篇電子書寫作的絕對首選。10 萬字以上仍維持品質和風格一致性。Projects 管理多章節寫作。',
        highlight: '用 Projects 分章節管理，Claude 確保全書風格一致',
      },
      gemini: {
        rating: 4,
        summary: 'NotebookLM 可將研究資料轉換為音訊摘要和教學內容。適合多媒體課程素材整理。',
        highlight: '用 NotebookLM 把研究資料變成 Podcast 式音訊內容',
      },
      grok: {
        rating: 3,
        summary: '基本內容生成能力，但長篇創作品質和工具整合不如其他選項。',
        highlight: '適合蒐集最新趨勢作為課程內容素材',
      },
      perplexity: {
        rating: 3.5,
        summary: '研究素材收集利器。為電子書和課程內容提供有據可查的資料基礎。',
        highlight: '用 Perplexity Pages 整理研究資料作為課程參考',
      },
      copilot: {
        rating: 3.5,
        summary: '基礎內容創作工具，Word 整合方便文件排版。但在創作深度方面不如 Claude。',
        highlight: '在 Word 中直接排版和格式化電子書內容',
      },
    },
  },
  {
    id: 'data-analysis',
    number: '12',
    name: '數據分析與成效追蹤',
    description: '分析課程滿意度、招生成效、社群數據、收入報表，用數據驅動教學與行銷決策。',
    recommend: 'gemini',
    evaluations: {
      chatgpt: {
        rating: 4.5,
        summary: 'Advanced Data Analysis / Code Interpreter 功能強大，可直接上傳 CSV、Excel 分析並生成圖表。',
        highlight: '上傳問卷 CSV，自動分析並生成視覺化報表',
      },
      claude: {
        rating: 4,
        summary: '分析能力佳，Artifacts 可即時預覽互動式圖表。擅長解讀數據背後的意義。',
        highlight: '用 Artifacts 生成互動式數據儀表板',
      },
      gemini: {
        rating: 5,
        summary: 'Google Analytics + Sheets + Looker Studio 原生整合。最完整的數據分析生態系，從收集到視覺化。',
        highlight: '直接在 Sheets 中用 Gemini 分析數據，一鍵生成 Looker 報表',
      },
      grok: {
        rating: 3.5,
        summary: '可分析 X/Twitter 社群數據和趨勢，但整體數據分析工具整合有限。',
        highlight: '分析 X 上的社群互動數據和話題趨勢',
      },
      perplexity: {
        rating: 3,
        summary: '可做競品研究和市場趨勢分析，提供有來源的洞察。但非數據分析工具。',
        highlight: '研究市場趨勢和同業數據作為策略參考',
      },
      copilot: {
        rating: 4.5,
        summary: 'Excel + Power BI 原生整合，從數據處理到視覺化報表一條龍。企業級分析能力。',
        highlight: '用 Excel Copilot 自動建立樞紐分析表和圖表',
      },
    },
  },
  {
    id: 'email',
    number: '13',
    name: '信件往來與溝通',
    description: '撰寫各類專業信件：邀課確認、報價、課前溝通、課後感謝、合作提案等商務書信。',
    recommend: 'copilot',
    evaluations: {
      chatgpt: {
        rating: 4,
        summary: '各類信件範本齊全，語氣可精確調整。適合需要多語言或特殊情境信件的講師。',
        highlight: '輸入情境，快速生成多種語氣版本的信件',
      },
      claude: {
        rating: 4.5,
        summary: '專業優雅措辭的首選。合約信件、正式商務書信的品質最高。語氣拿捏精準不生硬。',
        highlight: '合約條款和正式商務信件的用詞最專業到位',
      },
      gemini: {
        rating: 4.5,
        summary: 'Gmail 原生整合，智慧回覆和草稿建議直接在信箱中使用。Google Workspace 使用者首選。',
        highlight: '在 Gmail 中直接用 Gemini 撰寫和回覆信件',
      },
      grok: {
        rating: 3,
        summary: '基本信件撰寫能力，但缺乏郵件工具整合。語氣較隨性，正式信件需額外調整。',
        highlight: '適合撰寫較輕鬆的社群訊息和非正式溝通',
      },
      perplexity: {
        rating: 2.5,
        summary: '非信件撰寫工具。不適合日常書信往來。',
        highlight: '不建議用於此流程',
      },
      copilot: {
        rating: 5,
        summary: 'Outlook 原生整合王者。自動排程、智慧回覆、會議安排一氣呵成。最方便的商務信件助手。',
        highlight: 'Outlook 中一鍵生成回信、安排會議、設定追蹤提醒',
      },
    },
  },
  {
    id: 'admin',
    number: '14',
    name: '邀課單位庶務流程',
    description: '處理與邀課單位的行政流程：合約簽訂、場地確認、設備需求、交通住宿、發票核銷等。',
    recommend: 'copilot',
    evaluations: {
      chatgpt: {
        rating: 4,
        summary: 'Custom GPTs 可建立 SOP 助手，將繁瑣的行政流程系統化。適合建立個人化的庶務助手。',
        highlight: '建立「邀課庶務助手」GPT，輸入單位資訊自動生成確認清單',
      },
      claude: {
        rating: 4.5,
        summary: '合約審查和文件分析能力最強。可快速理解合約條款、找出潛在問題、建議修改。',
        highlight: '上傳合約，Claude 逐條分析風險並建議修改',
      },
      gemini: {
        rating: 4.5,
        summary: 'Google Workspace 自動化（Docs、Sheets、Calendar）。可建立自動化的行政管理流程。',
        highlight: '用 Sheets + Calendar + Gemini 自動管理邀課行程和庶務',
      },
      grok: {
        rating: 2.5,
        summary: '行政庶務功能有限，缺乏生產力工具整合。不建議作為庶務處理工具。',
        highlight: '不建議用於此流程',
      },
      perplexity: {
        rating: 2.5,
        summary: '無行政管理功能。不適合庶務流程。',
        highlight: '不建議用於此流程',
      },
      copilot: {
        rating: 5,
        summary: 'Microsoft 365 全套整合的最完整行政助手。Excel 報表、Word 合約、Outlook 排程、Teams 溝通。',
        highlight: '全套 Microsoft 365 自動化：合約到核銷一條龍管理',
      },
    },
  },
];

// 統計摘要
export const summary = {
  totalWorkflows: 14,
  totalTools: 6,
  totalEvaluations: 84,
  topByCategory: {
    '長篇寫作': 'claude',
    '行銷創意': 'chatgpt',
    '辦公整合': 'copilot',
    'Google 生態系': 'gemini',
    '社群趨勢': 'grok',
    '研究查證': 'perplexity',
  },
  recommendCounts: {
    claude: 4,
    copilot: 4,
    chatgpt: 2,
    gemini: 3,
    grok: 1,
    perplexity: 0,
  },
};
