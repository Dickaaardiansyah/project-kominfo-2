// src/components/History/StatsOverview.jsx
import React from 'react';

function StatsOverview({ transactions }) {
  const completed = transactions.filter(t => t.status === 'completed');
  const totalSpent = completed.reduce((sum, t) => sum + t.total, 0);
  const avgTransaction = completed.length > 0 ? totalSpent / completed.length : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-number">{transactions.length}</div>
        <div className="stat-label">Total Transaksi</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{completed.length}</div>
        <div className="stat-label">Transaksi Selesai</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{formatCurrency(totalSpent)}</div>
        <div className="stat-label">Total Pengeluaran</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{formatCurrency(avgTransaction)}</div>
        <div className="stat-label">Rata-rata Transaksi</div>
      </div>
    </div>
  );
}

export default StatsOverview;