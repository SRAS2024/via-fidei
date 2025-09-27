// client/src/components/Pagination.js
import React from "react";

export default function Pagination({
  page = 1,
  total = 0,
  perPage = 10,
  onChange,
}) {
  const pageCount = Math.max(1, Math.ceil(total / perPage));

  function go(next) {
    if (!onChange) return;
    const clamped = Math.min(pageCount, Math.max(1, next));
    if (clamped !== page) onChange(clamped);
  }

  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pageCount, start + 4);
  for (let i = start; i <= end; i++) items.push(i);

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="page-btn"
        onClick={() => go(1)}
        disabled={page === 1}
        aria-label="First page"
      >
        «
      </button>
      <button
        type="button"
        className="page-btn"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        ‹
      </button>

      {items.map((i) => (
        <button
          type="button"
          key={i}
          className="page-btn"
          aria-current={i === page ? "page" : undefined}
          onClick={() => go(i)}
        >
          {i}
        </button>
      ))}

      <button
        type="button"
        className="page-btn"
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
      >
        ›
      </button>
      <button
        type="button"
        className="page-btn"
        onClick={() => go(pageCount)}
        disabled={page === pageCount}
        aria-label="Last page"
      >
        »
      </button>
    </nav>
  );
}
