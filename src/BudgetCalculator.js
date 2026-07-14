import React, { useState } from 'react';

function BudgetCalculator({ transactions, onBack }) {
  const catMap = {};
  transactions.forEach(t => {
    if (t.type === 'Expense') catMap[t.category] = (catMap[t.category] || 0) + t.amount;
  });

  const [budgets, setBudgets] = useState(
    Object.keys(catMap).reduce((acc, cat) => ({ ...acc, [cat]: '' }), {})
  );
  const [newCat, setNewCat] = useState('');
  const [newBudgetAmt, setNewBudgetAmt] = useState('');

  const allCats = Object.keys(budgets);
  const totalBudget = allCats.reduce((s, c) => s + (Number(budgets[c]) || 0), 0);
  const totalSpent = allCats.reduce((s, c) => s + (catMap[c] || 0), 0);
  const remaining = totalBudget - totalSpent;

  function setOne(cat, val) { setBudgets(prev => ({ ...prev, [cat]: val })); }

  function addCustom() {
    if (!newCat.trim()) return;
    setBudgets(prev => ({ ...prev, [newCat.trim()]: newBudgetAmt }));
    setNewCat(''); setNewBudgetAmt('');
  }

  function getStatus(cat) {
    const spent = catMap[cat] || 0;
    const budget = Number(budgets[cat]) || 0;
    if (!budget) return { pct: 0, color: '#6b7280', label: 'No budget set' };
    const pct = (spent / budget) * 100;
    if (pct >= 100) return { pct: 100, color: '#ef4444', label: 'Over budget!' };
    if (pct >= 75) return { pct, color: '#f97316', label: 'Near limit' };
    return { pct, color: '#22c55e', label: 'On track' };
  }

  return (
    <div className="page-view">
      <div className="page-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>Budget Calculator</h2>
        <span />
      </div>

      <div className="page-content">
        {/* Summary strip */}
        <div className="budget-summary">
          <div className="bsummary-card" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
            <div className="bsummary-label">Total Budget</div>
            <div className="bsummary-value">₹{totalBudget.toLocaleString()}</div>
          </div>
          <div className="bsummary-card" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
            <div className="bsummary-label">Total Spent</div>
            <div className="bsummary-value">₹{totalSpent.toLocaleString()}</div>
          </div>
          <div className="bsummary-card" style={{ background: remaining >= 0 ? 'linear-gradient(135deg,#22c55e,#15803d)' : 'linear-gradient(135deg,#ef4444,#b91c1c)' }}>
            <div className="bsummary-label">Remaining</div>
            <div className="bsummary-value">₹{remaining.toLocaleString()}</div>
          </div>
        </div>

        {/* Per-category cards */}
        <div className="budget-cards">
          {allCats.map(cat => {
            const spent = catMap[cat] || 0;
            const { pct, color, label } = getStatus(cat);
            return (
              <div key={cat} className="budget-card">
                <div className="budget-card-header">
                  <span className="budget-cat-name">{cat}</span>
                  <span className="budget-status-label" style={{ color }}>{label}</span>
                </div>
                <div className="budget-amounts">
                  <span>Spent: <strong>₹{spent.toLocaleString()}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    Budget:
                    <input
                      type="number"
                      className="budget-inline-input"
                      placeholder="₹ Set limit"
                      value={budgets[cat]}
                      onChange={e => setOne(cat, e.target.value)}
                    />
                  </span>
                </div>
                <div className="budget-track">
                  <div className="budget-fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                {Number(budgets[cat]) > 0 && (
                  <div className="budget-pct" style={{ color }}>{pct.toFixed(1)}% used</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add custom category */}
        <div className="budget-add-row">
          <input className="budget-input-lg" placeholder="New category name" value={newCat} onChange={e => setNewCat(e.target.value)} />
          <input className="budget-input-lg" type="number" placeholder="Budget amount (₹)" value={newBudgetAmt} onChange={e => setNewBudgetAmt(e.target.value)} />
          <button className="budget-add-btn" onClick={addCustom}>+ Add Category</button>
        </div>
      </div>
    </div>
  );
}

export default BudgetCalculator;
