import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import FinancialInsights from './FinancialInsights';
import BudgetCalculator from './BudgetCalculator';
import HealthScore from './HealthScore';

const initialTransactions = [
  { date: "2025-01-01", desc: "Salary", category: "Income", amount: 50000, type: "Income" },
  { date: "2025-01-03", desc: "Groceries", category: "Food", amount: 4000, type: "Expense" },
  { date: "2025-01-05", desc: "Rent", category: "Housing", amount: 12000, type: "Expense" },
  { date: "2025-01-10", desc: "Internet Bill", category: "Utilities", amount: 1500, type: "Expense" },
  { date: "2025-01-15", desc: "Freelance Work", category: "Income", amount: 8000, type: "Income" }
];

function App() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isLogin, setIsLogin] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [tDate, setTDate] = useState('');
  const [tDesc, setTDesc] = useState('');
  const [tCategory, setTCategory] = useState('');
  const [tAmount, setTAmount] = useState('');
  const [tType, setTType] = useState('Income');
  const [extraSavings, setExtraSavings] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [activePage, setActivePage] = useState(null); // 'insights' | 'budget' | 'health'

  // --- NEW: auth state ---
  const [user, setUser] = useState(null);       // null = logged out, string = email
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  const chartRef = useRef(null);

  // KPI calculations
  let income = 0, expense = 0;
  transactions.forEach(t => {
    if (t.type === "Income") income += t.amount;
    else expense += t.amount;
  });
  const savings = income - expense;

  function addTransaction() {
    if (!tDate || !tDesc || !tCategory || Number(tAmount) <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }
    setTransactions([...transactions, { date: tDate, desc: tDesc, category: tCategory, amount: Number(tAmount), type: tType }]);
    setTDate('');
    setTDesc('');
    setTCategory('');
    setTAmount('');
  }

  // --- NEW: delete a transaction by index ---
  function deleteTransaction(idx) {
    setTransactions(transactions.filter((_, i) => i !== idx));
  }

  function simulate() {
    const extra = Number(extraSavings);
    if (extra <= 0) { setSimResult({ error: 'Enter a valid amount.' }); return; }
    setSimResult({
      yr1: savings + extra * 12,
      yr3: savings + extra * 36,
      yr5: savings + extra * 60,
    });
  }

  function openAuth() { setAuthModalOpen(true); setAuthError(''); }
  function closeAuth() { setAuthModalOpen(false); setAuthError(''); setAuthEmail(''); setAuthPassword(''); }
  function toggleAuth() { setIsLogin(!isLogin); setAuthError(''); }

  // --- NEW: handle login / signup ---
  function handleAuth() {
    if (!authEmail || !/\S+@\S+\.\S+/.test(authEmail)) {
      setAuthError("Enter a valid email address.");
      return;
    }
    if (!authPassword || authPassword.length < 4) {
      setAuthError("Password must be at least 4 characters.");
      return;
    }
    setUser(authEmail);
    closeAuth();
  }

  function handleLogout() { setUser(null); }

  function toggleDarkMode() { setDarkMode(!darkMode); }

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // --- NEW: draw bar chart reactively whenever transactions change ---
  useEffect(() => {
    const canvas = chartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Aggregate expenses by category
    const catMap = {};
    transactions.forEach(t => {
      if (t.type === 'Expense') {
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });
    const labels = Object.keys(catMap);
    const values = Object.values(catMap);
    const maxVal = Math.max(...values, 1);

    const W = canvas.width, H = canvas.height;
    const pad = 50, barW = Math.max(30, (W - pad * 2) / (labels.length || 1) - 20);
    const colors = ['#f97316','#3b82f6','#22c55e','#a855f7','#ec4899','#14b8a6','#f59e0b'];

    ctx.clearRect(0, 0, W, H);

    // Y-axis grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = pad + ((H - pad * 2) / 4) * i;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Segoe UI';
      ctx.textAlign = 'right';
      ctx.fillText('₹' + Math.round(maxVal * (1 - i / 4)).toLocaleString(), pad - 8, y + 4);
    }

    // Bars
    labels.forEach((label, i) => {
      const barH = ((values[i] / maxVal) * (H - pad * 2));
      const x = pad + i * ((W - pad * 2) / labels.length) + 10;
      const y = H - pad - barH;

      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]) : ctx.rect(x, y, barW, barH);
      ctx.fill();

      // Label
      ctx.fillStyle = '#1f2937';
      ctx.font = '12px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText(label, x + barW / 2, H - pad + 16);

      // Value on top
      ctx.fillStyle = colors[i % colors.length];
      ctx.font = 'bold 12px Segoe UI';
      ctx.fillText('₹' + values[i].toLocaleString(), x + barW / 2, y - 6);
    });

    if (labels.length === 0) {
      ctx.fillStyle = '#6b7280';
      ctx.font = '16px Segoe UI';
      ctx.textAlign = 'center';
      ctx.fillText('No expense data to display', W / 2, H / 2);
    }
  }, [transactions]);

  // Page routing — render page views instead of main app
  if (activePage === 'insights') return <FinancialInsights transactions={transactions} income={income} expense={expense} savings={savings} onBack={() => setActivePage(null)} />;
  if (activePage === 'budget')   return <BudgetCalculator transactions={transactions} onBack={() => setActivePage(null)} />;
  if (activePage === 'health')   return <HealthScore income={income} expense={expense} savings={savings} onBack={() => setActivePage(null)} />;

  return (
    <div>
      {/* AUTH MODAL */}
      <div className="auth-modal" style={{ display: authModalOpen ? 'flex' : 'none' }}>
        <div className="auth-box">
          <span className="close-btn" onClick={closeAuth}>×</span>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

          <input
            type="email"
            id="authEmail"
            placeholder="Email address"
            value={authEmail}
            onChange={e => { setAuthEmail(e.target.value); setAuthError(''); }}
          />
          <input
            type="password"
            id="authPassword"
            placeholder="Password"
            value={authPassword}
            onChange={e => { setAuthPassword(e.target.value); setAuthError(''); }}
          />

          <button className="primary-btn full-btn" onClick={handleAuth}>Continue</button>

          {authError && <p id="authError" style={{ color: 'red', fontSize: '13px', marginTop: '8px' }}>{authError}</p>}
          <p className="auth-switch">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <span onClick={toggleAuth}>{isLogin ? 'Sign up' : 'Login'}</span>
          </p>
          <p className="auth-note">FOR ACADEMIC USE ONLY</p>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo"><span className="fin">Fin</span><span className="bank">Bank</span></div>

        <ul>
          <li><a href="#hero">Home</a></li>
          <li><a href="#service-tabs">Services</a></li>
          <li><a href="#feature-section">Discover</a></li>
          <li><a href="#dashboard">Dashboard</a></li>
        </ul>

        <div className="nav-actions">
          <input type="text" className="search-bar" placeholder="Search..." />
          {/* NEW: show user or login button */}
          {user ? (
            <>
              <span className="nav-user">Hi, {user.split('@')[0]}</span>
              <button className="nav-login-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <button className="nav-login-btn" onClick={openAuth}>Login / Sign Up</button>
          )}
          <button className="nav-login-btn" onClick={toggleDarkMode}>{darkMode ? 'Light' : 'Dark'}</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-text">
          <h1>Not just banking,<br />your world elevated</h1>
          <p>A digital personal finance and banking analytics platform designed to help users understand spending, savings, and financial planning with data-driven insights.</p>
          <a href="#help" className="primary-btn">Know more</a>
        </div>

        <div className="hero-image">
          <video autoPlay muted loop playsInline>
            <source src="webbank.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      {/* SERVICE TABS */}
      <section className="service-tabs" id="service-tabs">
        <div className="service-grid">
          <a href="https://www.investopedia.com/premier-banking-5180452" target="_blank" rel="noreferrer" className="service-item">Premier Banking <span>›</span></a>
          <a href="https://www.investopedia.com/credit-cards-4689747" target="_blank" rel="noreferrer" className="service-item">Credit Cards <span>›</span></a>
          <a href="https://www.investopedia.com/home-loan-4689746" target="_blank" rel="noreferrer" className="service-item">Home Loans <span>›</span></a>
          <a href="https://www.investopedia.com/investing-4427685" target="_blank" rel="noreferrer" className="service-item">Investments <span>›</span></a>
          <a href="https://www.rbi.org.in/Scripts/FAQView.aspx?Id=9" target="_blank" rel="noreferrer" className="service-item">NRI Services <span>›</span></a>
          <a href="https://www.investopedia.com/salary-account-5216036" target="_blank" rel="noreferrer" className="service-item">Salary Accounts <span>›</span></a>
          <a href="https://www.investopedia.com/personal-loan-4689748" target="_blank" rel="noreferrer" className="service-item">Personal Loans <span>›</span></a>
          <a href="https://www.investopedia.com/terms/i/insurance.asp" target="_blank" rel="noreferrer" className="service-item">Insurance <span>›</span></a>
        </div>
      </section>

      {/* HELP SECTION */}
      <section className="help-section" id="help">
        <h2>How can we help you?</h2>
        <p className="help-subtext">Find quick answers and support for your banking needs.</p>

        <div className="help-grid">
          <div className="help-card">
            <img src="accounts.jpg" className="help-img" alt="Accounts" />
            <h3>Account &amp; Transactions</h3>
            <p>Balances and statements</p>
          </div>
          <div className="help-card">
            <img src="card.jpg" className="help-img" alt="Cards" />
            <h3>Cards &amp; Payments</h3>
            <p>Debit and credit help</p>
          </div>
          <div className="help-card">
            <img src="loans.jpg" className="help-img" alt="Loans" />
            <h3>Loans &amp; Investments</h3>
            <p>Loan and EMI info</p>
          </div>
          <div className="help-card">
            <img src="support.jpg" className="help-img" alt="Support" />
            <h3>Security &amp; Support</h3>
            <p>Fraud and support</p>
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="dashboard" id="dashboard">
        <h2>Financial Analytics Dashboard</h2>

        <div className="kpi-container">
          <div className="kpi"><h3>Total Income</h3><p id="totalIncome">₹{income.toLocaleString()}</p></div>
          <div className="kpi"><h3>Total Expenses</h3><p id="totalExpense">₹{expense.toLocaleString()}</p></div>
          <div className="kpi"><h3>Savings</h3><p id="totalSavings">₹{savings.toLocaleString()}</p></div>
        </div>

        {/* TOOL CARDS */}
        <div className="tool-cards">
          <div className="tool-card tool-card-blue" onClick={() => setActivePage('insights')}>
            <div className="tool-card-icon">📊</div>
            <div className="tool-card-body">
              <h3>Financial Insights</h3>
              <p>Deep-dive into your spending patterns, category breakdown, and smart tips.</p>
            </div>
            <div className="tool-card-arrow">→</div>
          </div>
          <div className="tool-card tool-card-orange" onClick={() => setActivePage('budget')}>
            <div className="tool-card-icon">🎯</div>
            <div className="tool-card-body">
              <h3>Budget Calculator</h3>
              <p>Set monthly limits per category and track spending against your targets.</p>
            </div>
            <div className="tool-card-arrow">→</div>
          </div>
          <div className="tool-card tool-card-green" onClick={() => setActivePage('health')}>
            <div className="tool-card-icon">💚</div>
            <div className="tool-card-body">
              <h3>Financial Health Score</h3>
              <p>Get a personalised wellness score based on your income and expense ratio.</p>
            </div>
            <div className="tool-card-arrow">→</div>
          </div>
        </div>

        <div className="main-grid">
          {/* TRANSACTION TABLE */}
          <section className="card">
            <h3>Transaction History</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="transactionTable">
                {transactions.map((t, i) => (
                  <tr key={i}>
                    <td>{t.date}</td>
                    <td>{t.desc}</td>
                    <td>{t.category}</td>
                    <td>₹{t.amount.toLocaleString()}</td>
                    {/* NEW: colored badge */}
                    <td><span className={`type-badge ${t.type === 'Income' ? 'badge-income' : 'badge-expense'}`}>{t.type}</span></td>
                    {/* NEW: delete button */}
                    <td><button className="delete-btn" onClick={() => deleteTransaction(i)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* SIMULATOR */}
          <section className="card sim-card">
            <div className="sim-header">
              <span className="sim-icon">🔮</span>
              <div>
                <h3 style={{ margin: 0 }}>What-If Simulator</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>See how extra savings compound over time</p>
              </div>
            </div>
            <div className="sim-input-row">
              <span className="sim-prefix">₹</span>
              <input className="sim-input" type="number" id="extraSavings" placeholder="Extra monthly savings" value={extraSavings} onChange={e => setExtraSavings(e.target.value)} />
              <button className="sim-btn" onClick={simulate}>Simulate</button>
            </div>
            {simResult && (
              simResult.error
                ? <p className="sim-error">{simResult.error}</p>
                : <div className="sim-results">
                    <div className="sim-result-card" style={{ '--rc': '#3b82f6' }}>
                      <div className="sim-result-yr">1 Year</div>
                      <div className="sim-result-amt">₹{simResult.yr1.toLocaleString()}</div>
                    </div>
                    <div className="sim-result-card" style={{ '--rc': '#f97316' }}>
                      <div className="sim-result-yr">3 Years</div>
                      <div className="sim-result-amt">₹{simResult.yr3.toLocaleString()}</div>
                    </div>
                    <div className="sim-result-card" style={{ '--rc': '#22c55e' }}>
                      <div className="sim-result-yr">5 Years</div>
                      <div className="sim-result-amt">₹{simResult.yr5.toLocaleString()}</div>
                    </div>
                  </div>
            )}
          </section>

          {/* ADD TRANSACTION */}
          <section className="card add-card">
            <div className="add-card-header">
              <span className="add-card-icon">➕</span>
              <div>
                <h3 style={{ margin: 0 }}>Add Transaction</h3>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--muted)' }}>Record a new income or expense</p>
              </div>
            </div>
            <div className="add-form-grid">
              <div className="form-group">
                <label className="form-label">📅 Date</label>
                <input className="form-input" type="date" id="tDate" value={tDate} onChange={e => setTDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">📝 Description</label>
                <input className="form-input" type="text" id="tDesc" placeholder="e.g. Monthly salary" value={tDesc} onChange={e => setTDesc(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">🏷️ Category</label>
                <input className="form-input" type="text" id="tCategory" placeholder="e.g. Food, Housing" value={tCategory} onChange={e => setTCategory(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">💰 Amount (₹)</label>
                <input className="form-input" type="number" id="tAmount" placeholder="0" value={tAmount} onChange={e => setTAmount(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">⚡ Type</label>
                <select className="form-input" id="tType" value={tType} onChange={e => setTType(e.target.value)}>
                  <option>Income</option>
                  <option>Expense</option>
                </select>
              </div>
              <div className="form-group form-group-btn">
                <button className="add-submit-btn" onClick={addTransaction}>Add Transaction</button>
              </div>
            </div>
          </section>
        </div>

        {/* CHART — now drawn by useEffect */}
        <div className="card">
          <h3>Spending by Category</h3>
          <canvas ref={chartRef} id="categoryChart" width="700" height="350"></canvas>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h4>Quick Links</h4>
          <a href="#hero">Home</a>
          <a href="#service-tabs">Services</a>
          <a href="#dashboard">Dashboard</a>
        </div>

        <div>
          <h4>Resources</h4>
          <a href="https://www.rbi.org.in" target="_blank" rel="noreferrer">RBI</a>
          <a href="https://www.investopedia.com" target="_blank" rel="noreferrer">Investopedia</a>
          <a href="https://www.kaggle.com" target="_blank" rel="noreferrer">Kaggle</a>
        </div>

        <div>
          <h4>Contact Us</h4>
          <p>Email: support@finbank.com</p>
          <p>Phone: +91 90000 12345</p>
        </div>

        <div>
          <h4>Legal</h4>
          <p>Academic Banking Demo System</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
