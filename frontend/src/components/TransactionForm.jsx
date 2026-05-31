import { useState } from "react";

import { createTransaction } from "../services/api";


function TransactionForm({ onTransactionAdded }) {
  // useState: stores form input values while the user types.
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Submit data: backend also needs category and date, so defaults are sent for now.
    const transaction = {
      description,
      amount: Number(amount),
      category: "Uncategorized",
      transaction_date: new Date().toISOString().slice(0, 10),
    };

    try {
      await createTransaction(transaction);

      // Clear form after successful submission.
      setDescription("");
      setAmount("");
      setSuccessMessage("Transaction added successfully.");

      // Props flow: notify Dashboard so it can refresh the transaction list.
      onTransactionAdded();
    } catch (error) {
      setErrorMessage("Unable to add transaction. Please try again.");
    }
  }

  function handleReset() {
    setDescription("");
    setAmount("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  return (
    <section className="panel transaction-form-panel">
      <div>
        <h2>Add Transaction</h2>
        <p className="muted-text">Track a new expense in your FinSight AI dashboard.</p>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Example: Zomato"
            required
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="Example: 500"
            required
          />
        </label>

        <div className="form-actions">
          <button type="submit">
            <span>Add Transaction</span>
          </button>
          <button type="button" className="secondary-button" onClick={handleReset}>
            <span>Reset</span>
          </button>
        </div>
      </form>

      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </section>
  );
}


export default TransactionForm;
