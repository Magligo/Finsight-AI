import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

import { CATEGORIES, formatCurrency, normalizeCategory } from "../utils/finance";


const PAGE_SIZE = 8;


function TransactionTable({ transactions }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortKey, setSortKey] = useState("date-desc");
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    const nextTransactions = transactions.filter((transaction) => {
      const category = normalizeCategory(transaction.category);
      const matchesCategory = categoryFilter === "All" || category === categoryFilter;
      const searchableText = [
        transaction.description,
        transaction.amount,
        category,
        transaction.transaction_date,
      ]
        .join(" ")
        .toLowerCase();

      return matchesCategory && searchableText.includes(normalizedSearchTerm);
    });

    return [...nextTransactions].sort((first, second) => {
      if (sortKey === "amount-asc") {
        return Number(first.amount) - Number(second.amount);
      }

      if (sortKey === "amount-desc") {
        return Number(second.amount) - Number(first.amount);
      }

      if (sortKey === "date-asc") {
        return new Date(first.transaction_date) - new Date(second.transaction_date);
      }

      return new Date(second.transaction_date) - new Date(first.transaction_date);
    });
  }, [categoryFilter, searchTerm, sortKey, transactions]);

  const totalPages = Math.max(Math.ceil(filteredTransactions.length / PAGE_SIZE), 1);
  const safePage = Math.min(page, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function updateFilter(callback) {
    callback();
    setPage(1);
  }

  return (
    <section className="panel transaction-panel" id="transactions">
      <div className="section-title compact">
        <span className="eyebrow">Transactions</span>
        <h2>Recent Money Movement</h2>
      </div>

      <div className="table-toolbar">
        <label className="search-field" aria-label="Search transactions">
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => updateFilter(() => setSearchTerm(event.target.value))}
            placeholder="Search merchant, amount, category"
          />
        </label>

        <div className="table-controls">
          <label>
            Category
            <select
              value={categoryFilter}
              onChange={(event) => updateFilter(() => setCategoryFilter(event.target.value))}
            >
              <option value="All">All</option>
              {CATEGORIES.map((category) => (
                <option value={category} key={category}>{category}</option>
              ))}
            </select>
          </label>

          <label>
            Sort
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value)}>
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
              <option value="amount-desc">Amount high to low</option>
              <option value="amount-asc">Amount low to high</option>
            </select>
          </label>
        </div>
      </div>

      {transactions.length === 0 ? (
        <p className="empty-state">No transactions available yet.</p>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="transaction-table">
              <thead>
                <tr>
                  <th>Merchant</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction) => {
                  const category = normalizeCategory(transaction.category);

                  return (
                    <tr key={transaction.id}>
                      <td>{transaction.description}</td>
                      <td className="amount-cell">{formatCurrency(transaction.amount)}</td>
                      <td>
                        <span className={`category-badge badge-${category.toLowerCase()}`}>
                          {category}
                        </span>
                      </td>
                      <td>{transaction.transaction_date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filteredTransactions.length === 0 && (
              <p className="empty-search">No transactions match your filters.</p>
            )}
          </div>

          <div className="pagination-bar">
            <span>
              Page {safePage} of {totalPages}
            </span>
            <div>
              <button
                type="button"
                className="icon-button"
                onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
                disabled={safePage === 1}
                aria-label="Previous page"
                title="Previous page"
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="icon-button"
                onClick={() => setPage((currentPage) => Math.min(currentPage + 1, totalPages))}
                disabled={safePage === totalPages}
                aria-label="Next page"
                title="Next page"
              >
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

export default TransactionTable;
