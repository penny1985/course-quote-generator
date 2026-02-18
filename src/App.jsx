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
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const response = await fetch('/.netlify/functions/generate-quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageData: base64,
          mimeType: file.type
        })
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setQuotes(data.quotes || []);
      
    } catch (err) {
      setError('生成失敗：' + err.message);
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
    
    const gradients = [
      ['#1a1a2e', '#16213e'],
      ['#0f0f0f', '#1a1a1a'],
      ['#1a3a2e', '#0f2e1f'],
      ['#1a2a3e', '#0f1f3e'],
      ['#2a1a3e', '#1f0f3e'],
      ['#3e1a2a', '#2e0f1a'],
    ];
    
    const colors = gradients[index % gradients.length];
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(1, colors[1]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 裝飾
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 300, 0, Math.PI * 2);
    ctx.fill();
    
    // 引號
    ctx.font = '240px "Noto Serif TC", Georgia, serif';
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fillText('"', 60, 220);
    
    // 金句文字
    ctx.font = '52px "Noto Serif TC", serif';
    ctx.fillStyle = '#ffffff';
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
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.textAlign = 'right';
    ctx.fillText('陳沛孺', canvas.width - 80, canvas.height - 80);
    
    const link = document.createElement('a');
    link.download = `課程金句_${index + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app">
      {/* 背景 */}
      <div className="bg-gradient"></div>
      <div className="bg-blur"></div>
      
      {/* 隱藏的 Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">AI-Powered Tool</p>
          <h1>課程金句產生器</h1>
          <p className="hero-desc">
            上傳你的簡報，讓 AI 在 30 秒內<br />
            為你的課程提煉出令人印象深刻的金句
          </p>
          <button className="hero-cta" onClick={scrollToUpload}>
            開始使用
          </button>
        </div>
      </section>

      {/* How it works */}
      <section className="how-it-works">
        <div className="container">
          <h2>三步驟，輕鬆產出課程金句</h2>
          <div className="steps-grid">
            <StepCard 
              number="1"
              title="上傳簡報"
              description="將你的課程簡報截圖或 PDF 上傳，支援 PNG、JPG、PDF 格式"
            />
            <StepCard 
              number="2"
              title="AI 分析"
              description="Gemini AI 會分析你的內容，抓取核心概念與價值主張"
            />
            <StepCard 
              number="3"
              title="下載金句"
              description="獲得 6 句精煉的課程金句，可直接下載為社群圖卡"
            />
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="upload-section" ref={uploadRef}>
        <div className="container">
          <div className="upload-card">
            <h2>上傳你的簡報</h2>
            <p className="upload-subtitle">支援 PNG、JPG、PDF，建議上傳課程大綱或封面頁</p>
            
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
                  <p className="change-hint">點擊更換檔案</p>
                </div>
              ) : file ? (
                <div className="preview">
                  <div className="pdf-icon">PDF</div>
                  <p className="file-name">{file.name}</p>
                  <p className="change-hint">點擊更換檔案</p>
                </div>
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon-wrapper">
                    <div className="upload-arrow"></div>
                  </div>
                  <p className="upload-text">拖曳檔案到這裡，或點擊選擇</p>
                </div>
              )}
            </div>

            {file && (
              <button
                className={`generate-btn ${loading ? 'loading' : ''}`}
                onClick={generateQuotes}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    <span>AI 正在分析你的簡報...</span>
                  </>
                ) : (
                  '產生金句'
                )}
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
            <p className="results-subtitle">點擊任一卡片即可下載 1080×1080 社群圖</p>
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
            <h2>想學更多 AI 應用技巧？</h2>
            <p>追蹤閱讀塗鴉實驗室，獲得第一手的 AI 教學資源</p>
            <a
              href="https://www.facebook.com/readingdoodlelab"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              前往 Facebook 粉專
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>© 2025 陳沛孺 / 閱讀塗鴉實驗室</p>
        </div>
      </footer>
    </div>
  );
}
