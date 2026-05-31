import { useMemo, useState } from "react";

import Icon from "./Icon";


function TransactionTable({ transactions }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return transactions;
    }

    return transactions.filter((transaction) => {
      const searchableText = [
        transaction.description,
        transaction.amount,
        transaction.category,
        transaction.transaction_date,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchTerm);
    });
  }, [searchTerm, transactions]);

  return (
    <section className="panel transaction-panel">
      <div className="section-heading table-heading">
        <div>
          <h2>Transactions</h2>
          <p>Search and review your latest money movement.</p>
        </div>

        <label className="search-field" aria-label="Search transactions">
          <Icon name="search" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search transactions"
          />
        </label>
      </div>

      {transactions.length === 0 ? (
        <p className="muted-text">No transactions available yet.</p>
      ) : (
        <div className="table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td className="amount-cell">₹{Number(transaction.amount).toLocaleString()}</td>
                  <td>
                    <span className="category-badge">{transaction.category}</span>
                  </td>
                  <td>{transaction.transaction_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <p className="empty-search">No transactions match your search.</p>
          )}
        </div>
      )}
    </section>
  );
}


export default TransactionTable;
