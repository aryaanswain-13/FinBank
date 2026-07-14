import React from 'react';

const COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#f59e0b'];

function FinancialInsights({ transactions, income, expense, savings, onBack }) {
  const catMap = {};
  transactions.forEach(t => {
    if (t.type === 'Expense') catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });
  const expCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const maxExp = expCategories.length > 0 ? expCategories[0][1] : 1;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : 0;
  const expenseRatio = income > 0 ? ((expense / income) * 100).toFixed(1) : 0;

  const tips = [];
  if (Number(expenseRatio) > 80) tips.push({ icon: '🔴', text: 'Expenses exceed 80% of income. Consider cutting discretionary spending.' });
  if (Number(savingsRate) < 20) tips.push({ icon: '⚠️', text: 'Aim to save at least 20% of your income each month.' });
  if (catMap['Food'] > income * 0.3) tips.push({ icon: '🍔', text: 'Food spending is high. Meal planning can significantly reduce costs.' });
  if (Number(savingsRate) > 30) tips.push({ icon: '🌟', text: 'Outstanding savings rate! Consider investing the surplus for compound growth.' });
  if (tips.length === 0) tips.push({ icon: '✅', text: 'Your financial habits look solid — keep it up!' });

  return (
    <div className="page-view">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Financial Insights</h2>
        <span />
      </div>

      <div className="page-content">
        {/* Key metrics */}
        <div className="insight-metrics">
          <div className="metric-card" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            <div className="metric-value">{savingsRate}%</div>
            <div className="metric-label">Savings Rate</div>
          </div>
          <div className="metric-card" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
            <div className="metric-value">{expenseRatio}%</div>
            <div className="metric-label">Expense Ratio</div>
          </div>
          <div className="metric-card" style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)' }}>
            <div className="metric-value">{expCategories.length}</div>
            <div className="metric-label">Expense Categories</div>
          </div>
          <div className="metric-card" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
            <div className="metric-value">₹{savings.toLocaleString()}</div>
            <div className="metric-label">Net Savings</div>
          </div>
        </div>

        <div className="insight-grid">
          {/* Spending breakdown */}
          <div className="insight-card">
            <h3>Spending Breakdown</h3>
            {expCategories.length === 0
              ? <p style={{ color: 'var(--muted)' }}>No expense data yet.</p>
              : expCategories.map(([cat, amt], i) => (
                <div key={cat} className="cat-bar-row">
                  <div className="cat-bar-label">
                    <span>{cat}</span>
                    <span>₹{amt.toLocaleString()}</span>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${(amt / maxExp) * 100}%`, background: COLORS[i % COLORS.length] }} />
                  </div>
                  <div className="cat-bar-pct">{income > 0 ? ((amt / income) * 100).toFixed(1) : 0}% of income</div>
                </div>
              ))
            }
          </div>

          {/* Ratio + Tips */}
          <div className="insight-card">
            <h3>Income vs Expenses</h3>
            <div className="ratio-visual">
              <div className="ratio-bar">
                <div className="ratio-income" style={{ width: `${income > 0 ? (income / (income + expense)) * 100 : 50}%` }}>
                  Income
                </div>
                <div className="ratio-expense" style={{ width: `${income > 0 ? (expense / (income + expense)) * 100 : 50}%` }}>
                  Expense
                </div>
              </div>
              <div className="ratio-legend">
                <span><span className="dot dot-income" />₹{income.toLocaleString()}</span>
                <span><span className="dot dot-expense" />₹{expense.toLocaleString()}</span>
              </div>
            </div>

            <h3 style={{ marginTop: 24 }}>Smart Tips</h3>
            {tips.map((tip, i) => (
              <div key={i} className="tip-item">
                <span className="tip-icon">{tip.icon}</span>
                <span>{tip.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialInsights;
