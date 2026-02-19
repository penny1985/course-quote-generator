import React, { useState, useRef } from 'react';

// 使用步驟元件
function StepCard({ number, title, description }) {
  return (
    <div className="step-card">
      <div className="step-number">{number}</div>
      <div className="step-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

// 金句卡片元件
function QuoteCard({ quote, index, onDownload }) {
  return (
    <div 
      className={`quote-card quote-card-${index % 6}`}
      onClick={() => onDownload(index)}
    >
      <div className="quote-mark">"</div>
      <p className="quote-text">{quote}</p>
      <div className="quote-footer">
        <span className="quote-watermark">陳沛孺</span>
        <span className="quote-download">點擊下載</span>
      </div>
    </div>
  );
}

export default function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);
  const uploadRef = useRef(null);

  const scrollToUpload = () => {
    uploadRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('請上傳 PNG、JPG 或 PDF 格式的檔案');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setQuotes([]);
    
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const generateQuotes = async () => {
    if (!file) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result;
          const base64Data = result.split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = () => reject(new Error('檔案讀取失敗'));
        reader.readAsDataURL(file);
      });

      if (!base64) {
        throw new Error('無法讀取檔案內容');
      }
      
      const response = await fetch('/.netlify/functions/generate-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64,
          mimeType: file.type
        })
      });
      
      const text = await response.text();

      if (!text) {
        throw new Error('伺服器沒有回應');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Response was:', text);
        if (text.includes('<!DOCTYPE') || text.includes('<html')) {
          throw new Error('函式端點無法連線，請確認 Netlify Functions 已正確部署');
        }
        throw new Error('伺服器回應格式錯誤');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (!data.quotes || data.quotes.length === 0) {
        throw new Error('沒有產生任何金句');
      }
      
      setQuotes(data.quotes);
      
    } catch (err) {
      console.error('Generate error:', err);
      setError(err.message || '生成失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const downloadCard = (index) => {
    const quote = quotes[index];
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1080;
    canvas.height = 1080;
    
    // 品牌色系金句卡片
    const gradients = [
      ['#2d5a3d', '#1a3d2a'], // 深綠
      ['#5a4d2d', '#3d3320'], // 深金
      ['#3d5a4d', '#2a3d35'], // 藍綠
      ['#4d5a2d', '#353d20'], // 橄欖綠
      ['#5a3d2d', '#3d2820'], // 棕金
      ['#2d4a5a', '#1a3540'], // 墨綠藍
    ];
    
    const colors = gradients[index % gradients.length];
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 裝飾圓形
    ctx.fillStyle = 'rgba(212, 175, 55, 0.08)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.85, canvas.height * 0.15, 250, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(245, 240, 230, 0.05)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.1, canvas.height * 0.9, 200, 0, Math.PI * 2);
    ctx.fill();
    
    // 引號
    ctx.font = '240px "Noto Serif TC", Georgia, serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.15)';
    ctx.fillText('"', 60, 220);
    
    // 金句文字
    ctx.font = '52px "Noto Serif TC", serif';
    ctx.fillStyle = '#f5f0e6';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const maxWidth = canvas.width - 160;
    const lineHeight = 78;
    const chars = quote.split('');
    let line = '';
    let y = 320;
    
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 80, y);
        line = chars[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, y);
    
    // 浮水印
    ctx.font = '28px "Noto Sans TC", sans-serif';
    ctx.fillStyle = 'rgba(212, 175, 55, 0.6)';
    ctx.textAlign = 'right';
    ctx.fillText('陳沛孺', canvas.width - 80, canvas.height - 80);
    
    const link = document.createElement('a');
    link.download = `課程金句_${index + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app">
      {/* 背景裝飾 */}
      <div className="bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
      
      {/* 隱藏的 Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI 小工具</div>
          <h1>課程金句<br/>產生器</h1>
          <p className="hero-desc">
            上傳你的簡報，讓 AI 幫你提煉出<br/>
            讓學員一秒記住的課程金句
          </p>
          <button className="hero-cta" onClick={scrollToUpload}>
            立即試用
          </button>
        </div>
        <div className="hero-visual">
          <div className="card-stack">
            <div className="demo-card demo-card-1">"學會這個，省下三年摸索"</div>
            <div className="demo-card demo-card-2">"真正的效率是不做白工"</div>
            <div className="demo-card demo-card-3">"知道方法的人，不怕起步晚"</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <h2>怎麼使用？</h2>
          <div className="steps-grid">
            <StepCard 
              number="1"
              title="上傳簡報"
              description="把你的課程簡報截圖或存成 PDF 上傳"
            />
            <StepCard 
              number="2"
              title="等 AI 分析"
              description="Gemini 會讀懂你的內容，抓出核心價值"
            />
            <StepCard 
              number="3"
              title="下載金句圖"
              description="一鍵下載，直接發到社群或放進簡報"
            />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="upload-section" ref={uploadRef}>
        <div className="container">
          <div className="upload-card">
            <h2>上傳你的簡報</h2>
            <p className="upload-subtitle">支援 PNG、JPG、PDF</p>
            
            <div
              className={`upload-zone ${dragOver ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.webp,.pdf"
                onChange={(e) => handleFileSelect(e.target.files[0])}
                style={{ display: 'none' }}
              />
              
              {preview ? (
                <div className="preview">
                  <img src={preview} alt="預覽" />
                  <p className="file-name">{file.name}</p>
                  <p className="change-hint">點擊更換</p>
                </div>
              ) : file ? (
                <div className="preview">
                  <div className="pdf-badge">PDF</div>
                  <p className="file-name">{file.name}</p>
                  <p className="change-hint">點擊更換</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-circle">
                    <span className="upload-plus">+</span>
                  </div>
                  <p className="upload-text">拖曳或點擊上傳</p>
                </div>
              )}
            </div>

            {file && (
              <button
                className={`generate-btn ${loading ? 'loading' : ''}`}
                onClick={generateQuotes}
                disabled={loading}
              >
                {loading ? '分析中...' : '產生金句'}
              </button>
            )}

            {error && (
              <div className="error-message">{error}</div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {quotes.length > 0 && (
        <section className="results-section">
          <div className="container">
            <h2>你的課程金句</h2>
            <p className="results-subtitle">點擊卡片下載 1080×1080 圖片</p>
            <div className="quotes-grid">
              {quotes.map((quote, index) => (
                <QuoteCard 
                  key={index} 
                  quote={quote} 
                  index={index}
                  onDownload={downloadCard}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-avatar">沛</div>
            <h2>這個工具是誰做的？</h2>
            <p>我是陳沛孺，專門教 40-55 歲專業人士<br/>用 AI 打造個人品牌與自動化系統</p>
            <a
              href="https://www.facebook.com/peiru1985"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              追蹤陳沛孺
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 陳沛孺 / 閱讀塗鴉實驗室</p>
      </footer>
    </div>
  );
}
