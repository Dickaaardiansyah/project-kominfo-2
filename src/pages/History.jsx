// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/History/Sidebar';
import HistoryHeader from '../components/History/HistoryHeader';
import HistoryTimeline from '../components/History/HistoryTimeline';
import StatsOverview from '../components/History/StatsOverview';
import '../styles/History.css';

function History() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    // Ini bisa diganti dengan API call
    const sampleData = [
      {
        id: "TRX-2023-001",
        date: "2023-05-15T10:30:00",
        status: "completed",
        items: [
          {
            icon: "🍔",
            name: "Burger Special",
            description: "Dengan keju dan saus spesial",
            price: 35000,
            quantity: 2
          }
        ],
        total: 70000
      },
      {
        id: "TRX-2023-002",
        date: "2023-05-16T14:45:00",
        status: "pending",
        items: [
          {
            icon: "☕",
            name: "Kopi Hitam",
            description: "Size Large",
            price: 20000,
            quantity: 1
          },
          {
            icon: "🍰",
            name: "Cheesecake",
            description: "Rasa strawberry",
            price: 25000,
            quantity: 1
          }
        ],
        total: 45000
      }
    ];
    
    setTransactions(sampleData);
    setFilteredTransactions(sampleData);
  }, []);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    if (filter === 'all') {
      setFilteredTransactions(transactions);
    } else {
      setFilteredTransactions(transactions.filter(t => t.status === filter));
    }
  };

  return (
    <div className="history-container">
      <Sidebar activeItem="history" />
      <div className="main-content">
        <HistoryHeader 
          title="History" 
          currentFilter={currentFilter}
          onFilterChange={handleFilterChange}
        />
        
        <StatsOverview transactions={filteredTransactions} />
        
        <HistoryTimeline 
          transactions={filteredTransactions} 
          onViewTransaction={(id) => console.log('View transaction:', id)}
        />
      </div>
    </div>
  );
}

export default History;