import React, { useState, useEffect, useRef, useCallback } from 'react';
import { tools, workflows, summary } from './data/evaluations';

/* ─── 評分視覺化 ─── */
function RatingBar({ rating, max = 5, animate = false }) {
  const pct = (rating / max) * 100;
  return (
    <div className="rating-bar">
      <div className="rating-bar__track">
        <div
          className={`rating-bar__fill ${animate ? 'animate' : ''}`}
          style={{ '--target-width': `${pct}%` }}
        />
      </div>
      <span className="rating-bar__value">{rating}</span>
    </div>
  );
}

/* ─── 工具標誌 ─── */
function ToolBadge({ tool, size = 'md' }) {
  return (
    <span
      className={`tool-badge tool-badge--${size}`}
      style={{ '--tool-color': tool.color }}
    >
      {tool.letter}
    </span>
  );
}

/* ─── Hero Section ─── */
function Hero() {
  return (
    <section className="hero">
      <div className="hero__grain" />
      <div className="hero__lines">
        <span /><span /><span /><span /><span />
      </div>
      <div className="hero__content">
        <p className="hero__edition">2026 Edition</p>
        <h1 className="hero__title">
          <span className="hero__title-line">講師 AI 工具</span>
          <span className="hero__title-line hero__title-line--accent">評測指南</span>
        </h1>
        <p className="hero__subtitle">
          以職業講師的 14 個核心工作流程為軸，<br />
          橫向對比 6 大主流 AI 工具的真實適用性。
        </p>
        <div className="hero__stats">
          <div className="hero__stat">
            <span className="hero__stat-num">{summary.totalWorkflows}</span>
            <span className="hero__stat-label">工作流程</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">{summary.totalTools}</span>
            <span className="hero__stat-label">AI 工具</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <span className="hero__stat-num">{summary.totalEvaluations}</span>
            <span className="hero__stat-label">項評比</span>
          </div>
        </div>
        <a href="#tools-overview" className="hero__cta">
          開始探索
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}

/* ─── 工具總覽卡片 ─── */
function ToolProfileCard({ tool, recommendCount }) {
  return (
    <div className="tool-profile" style={{ '--tool-color': tool.color }}>
      <div className="tool-profile__header">
        <ToolBadge tool={tool} size="lg" />
        <div>
          <h3 className="tool-profile__name">{tool.name}</h3>
          <p className="tool-profile__company">{tool.company}</p>
        </div>
      </div>
      <p className="tool-profile__models">{tool.models}</p>
      <p className="tool-profile__desc">{tool.description}</p>
      <ul className="tool-profile__features">
        {tool.features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      <div className="tool-profile__footer">
        <span className="tool-profile__pricing">{tool.pricing}</span>
        {recommendCount > 0 && (
          <span className="tool-profile__wins">{recommendCount} 項首選</span>
        )}
      </div>
    </div>
  );
}

/* ─── 工具總覽 Section ─── */
function ToolsOverview() {
  return (
    <section className="tools-overview" id="tools-overview">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Tools</span>
          <h2 className="section-title">六大 AI 工具一覽</h2>
          <p className="section-desc">2026 年主流 AI 工具，各有擅長的領域</p>
        </div>
        <div className="tools-grid">
          {tools.map(tool => (
            <ToolProfileCard
              key={tool.id}
              tool={tool}
              recommendCount={summary.recommendCounts[tool.id] || 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── 工作流程導覽列 ─── */
function WorkflowNav({ activeId, onSelect }) {
  const navRef = useRef(null);

  useEffect(() => {
    if (!navRef.current) return;
    const active = navRef.current.querySelector('.wf-nav__item--active');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeId]);

  return (
    <nav className="wf-nav" ref={navRef}>
      <div className="wf-nav__track">
        {workflows.map(wf => (
          <button
            key={wf.id}
            className={`wf-nav__item ${activeId === wf.id ? 'wf-nav__item--active' : ''}`}
            onClick={() => onSelect(wf.id)}
          >
            <span className="wf-nav__num">{wf.number}</span>
            <span className="wf-nav__name">{wf.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ─── 工具評比卡片（在工作流程中） ─── */
function EvalCard({ tool, evaluation, isRecommend, animate }) {
  return (
    <div className={`eval-card ${isRecommend ? 'eval-card--recommend' : ''}`} style={{ '--tool-color': tool.color }}>
      {isRecommend && <div className="eval-card__badge">首選推薦</div>}
      <div className="eval-card__header">
        <ToolBadge tool={tool} />
        <div className="eval-card__meta">
          <h4 className="eval-card__name">{tool.name}</h4>
          <RatingBar rating={evaluation.rating} animate={animate} />
        </div>
      </div>
      <p className="eval-card__summary">{evaluation.summary}</p>
      <div className="eval-card__tip">
        <span className="eval-card__tip-label">實用技巧</span>
        <p>{evaluation.highlight}</p>
      </div>
    </div>
  );
}

/* ─── 單一工作流程 Section ─── */
function WorkflowSection({ workflow, isVisible }) {
  const toolMap = {};
  tools.forEach(t => { toolMap[t.id] = t; });

  // 按評分排序，推薦的排第一
  const sorted = Object.entries(workflow.evaluations).sort((a, b) => {
    if (a[0] === workflow.recommend) return -1;
    if (b[0] === workflow.recommend) return 1;
    return b[1].rating - a[1].rating;
  });

  return (
    <div className={`wf-section ${isVisible ? 'wf-section--visible' : ''}`}>
      <div className="wf-section__header">
        <span className="wf-section__number">{workflow.number}</span>
        <div>
          <h3 className="wf-section__title">{workflow.name}</h3>
          <p className="wf-section__desc">{workflow.description}</p>
        </div>
      </div>
      <div className="eval-grid">
        {sorted.map(([toolId, evaluation], i) => (
          <EvalCard
            key={toolId}
            tool={toolMap[toolId]}
            evaluation={evaluation}
            isRecommend={toolId === workflow.recommend}
            animate={isVisible}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 比較矩陣（摘要表格） ─── */
function ComparisonMatrix() {
  const toolMap = {};
  tools.forEach(t => { toolMap[t.id] = t; });

  return (
    <section className="matrix-section" id="matrix">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Matrix</span>
          <h2 className="section-title">總覽比較矩陣</h2>
          <p className="section-desc">一眼看懂每個工作流程的最佳選擇</p>
        </div>
        <div className="matrix-scroll">
          <table className="matrix">
            <thead>
              <tr>
                <th className="matrix__corner">工作流程</th>
                {tools.map(tool => (
                  <th key={tool.id} style={{ '--tool-color': tool.color }}>
                    <ToolBadge tool={tool} size="sm" />
                    <span>{tool.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {workflows.map(wf => (
                <tr key={wf.id}>
                  <td className="matrix__wf">
                    <span className="matrix__wf-num">{wf.number}</span>
                    {wf.name}
                  </td>
                  {tools.map(tool => {
                    const ev = wf.evaluations[tool.id];
                    const isTop = tool.id === wf.recommend;
                    return (
                      <td
                        key={tool.id}
                        className={`matrix__cell ${isTop ? 'matrix__cell--top' : ''} ${ev.rating >= 4.5 ? 'matrix__cell--high' : ev.rating <= 2.5 ? 'matrix__cell--low' : ''}`}
                      >
                        {ev.rating}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="matrix-legend">
          <span className="matrix-legend__item matrix-legend__item--top">首選推薦</span>
          <span className="matrix-legend__item matrix-legend__item--high">4.5+</span>
          <span className="matrix-legend__item matrix-legend__item--mid">3 - 4</span>
          <span className="matrix-legend__item matrix-legend__item--low">2.5 以下</span>
        </div>
      </div>
    </section>
  );
}

/* ─── 結論 Section ─── */
function Conclusion() {
  const insights = [
    { tool: 'Claude', tip: '長篇寫作與深度回饋首選 — 講稿、電子書、作業批改都是它的主場' },
    { tool: 'Copilot', tip: '辦公行政效率之王 — 信件、簡報、CRM、庶務流程一站搞定' },
    { tool: 'Gemini', tip: 'Google 生態系最強整合 — 影片、數據分析、課堂互動的全能選手' },
    { tool: 'ChatGPT', tip: '行銷創意與圖片生成最佳 — 文案發想、社群圖卡、A/B 測試首選' },
    { tool: 'Grok', tip: '社群趨勢即時洞察 — 掌握 X 上最新話題，搶先佈局內容' },
    { tool: 'Perplexity', tip: '研究查證的學術利器 — 每個引用都有來源，教育方案僅 $10/月' },
  ];

  return (
    <section className="conclusion">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Insights</span>
          <h2 className="section-title">選擇策略</h2>
          <p className="section-desc">沒有最好的工具，只有最適合的搭配</p>
        </div>
        <div className="insights-grid">
          {insights.map((item, i) => (
            <div key={i} className="insight-card" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="insight-card__tool">{item.tool}</span>
              <p className="insight-card__tip">{item.tip}</p>
            </div>
          ))}
        </div>
        <div className="conclusion__note">
          <p>
            <strong>給講師的建議：</strong>不需要訂閱所有工具。建議從你最常用的 2-3 個工作流程出發，
            選擇對應的最佳工具組合。隨著使用深入，再逐步擴展你的 AI 工具庫。
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__rule" />
        <div className="footer__content">
          <p className="footer__credit">
            講師 AI 工具評測指南 &mdash; 2026 Edition
          </p>
          <p className="footer__note">
            評測內容基於 2026 年 2 月各工具的最新版本，僅供參考。
            <br />AI 工具更新快速，建議定期重新評估。
          </p>
          <p className="footer__author">
            © 2026 陳沛孺 / 閱讀塗鴉實驗室
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── 主應用 ─── */
export default function App() {
  const [activeWf, setActiveWf] = useState(workflows[0].id);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.dataset.section]));
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    Object.values(sectionRefs.current).forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleWfSelect = useCallback((id) => {
    setActiveWf(id);
    // Scroll to workflows area
    const el = document.getElementById('workflows');
    if (el) {
      const offset = el.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, []);

  const activeWorkflow = workflows.find(w => w.id === activeWf);

  return (
    <div className="app">
      <Hero />
      <ToolsOverview />

      {/* 工作流程評測區 */}
      <section className="workflows-section" id="workflows">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Workflows</span>
            <h2 className="section-title">14 個工作流程評測</h2>
            <p className="section-desc">點選工作流程，查看各 AI 工具的表現</p>
          </div>
        </div>

        <WorkflowNav activeId={activeWf} onSelect={handleWfSelect} />

        <div className="container">
          <div
            ref={el => { sectionRefs.current[activeWf] = el; }}
            data-section={activeWf}
          >
            <WorkflowSection
              workflow={activeWorkflow}
              isVisible={true}
            />
          </div>
        </div>
      </section>

      <ComparisonMatrix />
      <Conclusion />
      <Footer />
    </div>
  );
}
