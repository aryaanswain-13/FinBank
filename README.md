# FinBank

FinBank is a modern, interactive personal finance and banking analytics dashboard built using **React**. It is designed to help users track transactions, visualize spending patterns, set category budgets, and simulate future wealth growth with data-driven insights.

## Key Features

* **Financial Analytics Dashboard**: Real-time summary of Total Income, Total Expenses, and Net Savings.
* **Reactive Spending Chart**: A dynamic HTML5 Canvas bar chart that reactively aggregates and visualizes expenses by category.
* **Budget Calculator**: Set monthly spending limits per category, track budget usage, and receive color-coded warnings (near limit, over budget).
* **What-If Simulator**: Compounds monthly extra savings over 1, 3, and 5 years to project long-term financial growth.
* **Financial Health Score**: Evaluates your saving rate and expense control to give an automated wellness score and letter grade (A-F) with custom tips.
* **Dark Mode**: Seamless toggle between light and dark modes for comfortable day and night viewing.
* **Transaction Management**: Add or delete transactions with colored badges indicating transaction type.

## Tech Stack

* **Frontend**: React (Hooks, Canvas rendering)
* **Styling**: Vanilla CSS (including custom dark/light themes and glassmorphic designs)
* **Visuals**: Custom HTML5 Canvas rendering for performance-efficient charting (no heavy external chart libraries needed)

## Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aryaanswain-13/FinBank.git
   cd FinBank
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm start
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📝 Available Scripts

In the project directory, you can run:

* `npm start` - Runs the app in development mode.
* `npm run build` - Builds the app for production to the `build` folder.
* `npm test` - Launches the test runner.
