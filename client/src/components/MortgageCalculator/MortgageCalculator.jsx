import React, { useState } from "react";
import "./MortgageCalculator.css";

const MortgageCalculator = ({ price }) => {
  const [downPayment, setDownPayment] = useState(Math.round(price * 0.2)); // Default 20% down
  const [interestRate, setInterestRate] = useState(5.5); // Default 5.5% annual rate
  const [loanTerm, setLoanTerm] = useState(30); // Default 30 years
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateMortgage = () => {
    const principal = price - downPayment;
    if (principal <= 0) {
      setMonthlyPayment(0);
      return;
    }
    const monthlyRate = interestRate / 100 / 12;
    const totalPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      setMonthlyPayment(Math.round(principal / totalPayments));
      return;
    }

    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    setMonthlyPayment(Math.round(payment));
  };

  return (
    <div className="mortgage-calculator">
      <h3>Mortgage Estimator</h3>
      <div className="calculator-grid">
        <div className="calculator-field">
          <label>Property Price ($)</label>
          <input type="text" value={price} disabled />
        </div>
        <div className="calculator-field">
          <label>Down Payment ($)</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(Number(e.target.value))}
          />
        </div>
        <div className="calculator-field">
          <label>Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e.target.value))}
          />
        </div>
        <div className="calculator-field">
          <label>Loan Term (Years)</label>
          <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}>
            <option value={15}>15 Years</option>
            <option value={20}>20 Years</option>
            <option value={30}>30 Years</option>
          </select>
        </div>
      </div>

      <button className="button calc-btn" onClick={calculateMortgage}>
        Calculate Payment
      </button>

      {monthlyPayment !== null && (
        <div className="payment-result">
          <span>Estimated Monthly Payment:</span>
          <h4>${monthlyPayment}/mo</h4>
        </div>
      )}
    </div>
  );
};

export default MortgageCalculator;
