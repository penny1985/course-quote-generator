import React, { useState, useRef } from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

// 金句卡片元件
function QuoteCard({ quote, index, onDownload }) {
  const gradients = [
    ['#1a1a2e', '#16213e', '#0f3460'],
    ['#2d3436', '#000000', '#1a1a1a'],
    ['#134e5e', '#71b280', '#3d8b6e'],
    ['#373B44', '#4286f4', '#5a9cf4'],
    ['#8E2DE2', '#4A00E0', '#6b21d1'],
    ['#ee0979', '#ff6a00', '#ff8533'],
  ];
  
  const colors = gradients[index % gradients.length];
  
  return (
    <div 
      className="quote-card"
      onClick={() => onDownload(index)}
      style={{
        background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`,
      }}
    >
      <div className="quote-decoration">"</div>
      <p className="quote-text">{quote}</p>
      <div className="quote-watermark">陳沛孺</div>
      <div className="quote-hint">點擊下載圖片</div>
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
      ['#1a1a2e', '#16213e', '#0f3460'],
      ['#2d3436', '#000000', '#1a1a1a'],
      ['#134e5e', '#71b280', '#3d8b6e'],
      ['#373B44', '#4286f4', '#5a9cf4'],
      ['#8E2DE2', '#4A00E0', '#6b21d1'],
      ['#ee0979', '#ff6a00', '#ff8533'],
    ];
    
    const colors = gradients[index % gradients.length];
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 裝飾圓形
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.arc(canvas.width + 50, -50, 200, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = 'rgba(255,255,255,0.03)';
    ctx.beginPath();
    ctx.arc(-50, canvas.height + 50, 150, 0, Math.PI * 2);
    ctx.fill();
    
    // 引號
    ctx.font = '200px Georgia';
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fillText('"', 80, 200);
    
    // 金句文字
    ctx.font = 'bold 56px "Noto Serif TC", serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    
    const maxWidth = canvas.width - 160;
    const lineHeight = 84;
    const words = quote.split('');
    let line = '';
    let y = 300;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, 80, y);
        line = words[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 80, y);
    
    // 浮水印
    ctx.font = '32px "Noto Sans TC", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'right';
    ctx.fillText('陳沛孺', canvas.width - 80, canvas.height - 80);
    
    const link = document.createElement('a');
    link.download = `課程金句_${index + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app">
      {/* 動態背景 */}
      <div className="shader-bg">
        <MeshGradient
          colors={['#0f0f1a', '#1a1a2e', '#16213e', '#0f3460']}
          speed={0.15}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      {/* 隱藏的 Canvas */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="container">
        {/* 標題區 */}
        <header className="header">
          <h1>課程金句產生器</h1>
          <p>上傳你的簡報，AI 自動分析產出吸睛金句</p>
        </header>

        {/* 上傳區 */}
        <div
          className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
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
              <p>{file.name}</p>
            </div>
          ) : file ? (
            <div className="preview">
              <div className="file-icon">📄</div>
              <p>{file.name}</p>
            </div>
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📤</div>
              <p className="upload-text">拖曳簡報到這裡，或點擊上傳</p>
              <p className="upload-hint">支援 PNG、JPG、PDF 格式</p>
            </div>
          )}
        </div>

        {/* 生成按鈕 */}
        {file && (
          <button
            className={`generate-btn ${loading ? 'loading' : ''}`}
            onClick={generateQuotes}
            disabled={loading}
          >
            {loading ? '分析中...' : '✨ 產生金句'}
          </button>
        )}

        {/* 錯誤訊息 */}
        {error && (
          <div className="error-message">{error}</div>
        )}

        {/* 金句卡片區 */}
        {quotes.length > 0 && (
          <div className="quotes-section">
            <h2>你的課程金句</h2>
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

            {/* CTA */}
            <div className="cta-section">
              <p>想學更多 AI 課程設計技巧？</p>
              <a
                href="https://www.facebook.com/readingdoodlelab"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn"
              >
                追蹤 閱讀塗鴉實驗室
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
