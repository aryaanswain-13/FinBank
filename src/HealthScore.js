import React from 'react';

function polar(cx, cy, r, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) };
}

function HealthScore({ income, expense, savings, onBack }) {
  const savingsRate  = income > 0 ? savings / income : 0;
  const expenseRatio = income > 0 ? expense / income : 1;

  // Score: 50pts savings (target 30%), 30pts expense control (target <50%), 20pts base
  const savingsPts = Math.min(50, (Math.max(0, savingsRate) / 0.3) * 50);
  const expensePts = Math.min(30, (Math.max(0, (1 - expenseRatio)) / 0.5) * 30);
  const score = Math.min(100, Math.max(0, Math.round(savingsPts + expensePts + 20)));

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : score >= 20 ? 'D' : 'F';
  const gradeColor = score >= 80 ? '#22c55e' : score >= 60 ? '#3b82f6' : score >= 40 ? '#f97316' : score >= 20 ? '#ef4444' : '#991b1b';
  const gradeLabel = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Average' : score >= 20 ? 'Needs Work' : 'Critical';

  // SVG semicircle gauge (180° arc, left→right through top)
  const cx = 110, cy = 100, r = 75;
  const start      = polar(cx, cy, r, 180); // left
  const end        = polar(cx, cy, r, 0);   // right
  const scoreAngle = 180 - (score / 100) * 180;
  const scorePt    = polar(cx, cy, r, scoreAngle);
  const largeArc   = score > 50 ? 1 : 0;

  const bgPath   = `M ${start.x} ${start.y} A ${r} ${r} 0 0 1 ${end.x} ${end.y}`;
  const fillPath = score > 0 ? `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${scorePt.x} ${scorePt.y}` : '';

  const tips = [];
  if (savingsRate < 0.1)  tips.push({ icon: '⚠️', text: 'Savings are very low. Try to save at least 10% of your income each month.' });
  if (expenseRatio > 0.9) tips.push({ icon: '🔴', text: 'Expenses are dangerously high. Review subscriptions and non-essential spending.' });
  if (savingsRate >= 0.2) tips.push({ icon: '✅', text: 'Good savings rate! Consider putting surplus into a SIP or mutual fund.' });
  if (savingsRate >= 0.3) tips.push({ icon: '🌟', text: 'Excellent! You\'re saving 30%+ of income — well on the path to financial freedom.' });
  if (expenseRatio < 0.6) tips.push({ icon: '💚', text: 'Impressive spending discipline. Keep building your emergency fund (3-6 months of expenses).' });
  if (tips.length === 0)  tips.push({ icon: '💡', text: 'Add more transactions to get a more accurate health score.' });

  return (
    <div className="page-view">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>💚 Financial Health Score</h2>
        <span />
      </div>

      <div className="page-content">
        <div className="health-layout">
          {/* Gauge card */}
          <div className="health-gauge-card">
            <svg width="220" height="130" viewBox="0 0 220 130">
              <path d={bgPath} fill="none" stroke="#e5e7eb" strokeWidth="14" strokeLinecap="round" />
              {fillPath && <path d={fillPath} fill="none" stroke={gradeColor} strokeWidth="14" strokeLinecap="round" />}
              <text x={cx} y="92" textAnchor="middle" fontSize="34" fontWeight="800" fill={gradeColor}>{score}</text>
              <text x={cx} y="112" textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="500">out of 100</text>
            </svg>
            <div className="grade-badge" style={{ background: gradeColor }}>Grade {grade}</div>
            <div className="grade-label" style={{ color: gradeColor }}>{gradeLabel}</div>
          </div>

          {/* Breakdown */}
          <div className="health-breakdown">
            <h3>Score Breakdown</h3>

            <div className="breakdown-item">
              <div className="breakdown-label">
                <span>Savings Rate</span>
                <span style={{ fontWeight: 700 }}>{(savingsRate * 100).toFixed(1)}%</span>
              </div>
              <div className="budget-track">
                <div className="budget-fill" style={{ width: `${Math.min(100, (savingsPts / 50) * 100)}%`, background: '#3b82f6' }} />
              </div>
              <div className="breakdown-sub">Target: 30%+ · {savingsPts.toFixed(0)} / 50 pts</div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-label">
                <span>Expense Control</span>
                <span style={{ fontWeight: 700 }}>{(expenseRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="budget-track">
                <div className="budget-fill" style={{ width: `${Math.min(100, (expensePts / 30) * 100)}%`, background: '#f97316' }} />
              </div>
              <div className="breakdown-sub">Target: &lt;50% of income · {expensePts.toFixed(0)} / 30 pts</div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-label">
                <span>Base Score</span>
                <span style={{ fontWeight: 700 }}>20 / 20</span>
              </div>
              <div className="budget-track">
                <div className="budget-fill" style={{ width: '100%', background: '#22c55e' }} />
              </div>
              <div className="breakdown-sub">Awarded for actively tracking finances</div>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="insight-card" style={{ marginTop: 24 }}>
          <h3>Personalized Recommendations</h3>
          {tips.map((tip, i) => (
            <div key={i} className="tip-item">
              <span className="tip-icon">{tip.icon}</span>
              <span>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HealthScore;
