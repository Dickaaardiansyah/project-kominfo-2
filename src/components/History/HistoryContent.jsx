import React, { useState, useEffect } from 'react';
import FilterTabs from './FilterTabs';
import StatsOverview from './StatsOverview';
import FishTransactionList from './FishTransactionList';
import FishScanDetailModal from './FishScanDetailModal';

function HistoryContent({ searchQuery }) {
  const [fishScans, setFishScans] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('consumable'); // Default ke Konsumsi seperti di gambar
  const [filteredScans, setFilteredScans] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample data yang sesuai dengan gambar
  useEffect(() => {
    const sampleData = [
      {
        id: "FISH-2024-001",
        date: "2025-12-20T15:37:15",
        status: "completed",
        fishData: {
          name: "Ikan emas fir'aun",
          predicted_class: "Goldfish Pharaoh",
          confidence: "95.8%",
          habitat: "Air Tawar",
          konsumsi: "Dapat dikonsumsi",
          icon: "🐟",
          top_predictions: [
            { class: "Goldfish Pharaoh", confidence: "95.8%" },
            { class: "Common Goldfish", confidence: "87.3%" },
            { class: "Fancy Goldfish", confidence: "82.1%" }
          ]
        },
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      },
      {
        id: "FISH-2024-002",
        date: "2025-12-20T15:37:15",
        status: "completed",
        fishData: {
          name: "Ikan emas fir'aun",
          predicted_class: "Goldfish Pharaoh",
          confidence: "92.3%",
          habitat: "Air Tawar",
          konsumsi: "Tidak untuk konsumsi",
          icon: "🐠",
          top_predictions: [
            { class: "Goldfish Pharaoh", confidence: "92.3%" },
            { class: "Ornamental Goldfish", confidence: "88.7%" },
            { class: "Decorative Fish", confidence: "79.5%" }
          ]
        },
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      },
      {
        id: "FISH-2024-003",
        date: "2025-12-20T15:37:15",
        status: "completed",
        fishData: {
          name: "Ikan emas fir'aun",
          predicted_class: "Goldfish Pharaoh",
          confidence: "89.7%",
          habitat: "Air Tawar",
          konsumsi: "Dapat dikonsumsi",
          icon: "🐟",
          top_predictions: [
            { class: "Goldfish Pharaoh", confidence: "89.7%" },
            { class: "Golden Carp", confidence: "84.2%" },
            { class: "Yellow Fish", confidence: "76.8%" }
          ]
        },
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      },
      {
        id: "FISH-2024-004",
        date: "2025-12-20T15:37:15",
        status: "completed",
        fishData: {
          name: "Ikan emas fir'aun",
          predicted_class: "Goldfish Pharaoh",
          confidence: "94.2%",
          habitat: "Air Tawar",
          konsumsi: "Tidak untuk konsumsi",
          icon: "🐠",
          top_predictions: [
            { class: "Goldfish Pharaoh", confidence: "94.2%" },
            { class: "Aquarium Fish", confidence: "89.1%" },
            { class: "Ornamental Species", confidence: "81.3%" }
          ]
        },
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      },
      {
        id: "FISH-2024-005",
        date: "2025-12-20T15:37:15",
        status: "completed",
        fishData: {
          name: "Ikan emas fir'aun",
          predicted_class: "Goldfish Pharaoh",
          confidence: "91.5%",
          habitat: "Air Tawar",
          konsumsi: "Dapat dikonsumsi",
          icon: "🐟",
          top_predictions: [
            { class: "Goldfish Pharaoh", confidence: "91.5%" },
            { class: "Freshwater Goldfish", confidence: "86.7%" },
            { class: "Pond Fish", confidence: "79.2%" }
          ]
        },
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      },
      {
        id: "FISH-2024-006",
        date: "2025-12-20T15:37:15",
        status: "completed",
        fishData: {
          name: "Ikan emas fir'aun",
          predicted_class: "Goldfish Pharaoh",
          confidence: "88.9%",
          habitat: "Air Tawar",
          konsumsi: "Dapat dikonsumsi",
          icon: "🐟",
          top_predictions: [
            { class: "Goldfish Pharaoh", confidence: "88.9%" },
            { class: "Common Goldfish", confidence: "83.4%" },
            { class: "Freshwater Fish", confidence: "77.6%" }
          ]
        },
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
      }
    ];
    setFishScans(sampleData);
    // Set filtered scans ke konsumsi sebagai default
    setFilteredScans(sampleData.filter(scan => scan.fishData.konsumsi === 'Dapat dikonsumsi'));
  }, []);

  // Filter scans berdasarkan status dan search query
  useEffect(() => {
    let filtered = fishScans;

    // Filter berdasarkan kategori
    if (currentFilter === 'consumable') {
      filtered = fishScans.filter(scan => 
        scan.fishData.konsumsi === 'Dapat dikonsumsi'
      );
    } else if (currentFilter === 'ornamental') {
      filtered = fishScans.filter(scan => 
        scan.fishData.konsumsi === 'Tidak untuk konsumsi'
      );
    } else if (currentFilter === 'saved') {
      filtered = fishScans.filter(scan => scan.status === 'saved');
    }

    // Filter berdasarkan search query
    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(scan => 
        scan.fishData.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scan.fishData.predicted_class.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredScans(filtered);
  }, [fishScans, currentFilter, searchQuery]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleViewScan = (scanId) => {
    console.log('View scan:', scanId);
    const scan = fishScans.find(s => s.id === scanId);
    if (scan) {
      setSelectedScan(scan);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedScan(null);
  };

  const handleSaveScan = (scanId) => {
    console.log('Save scan:', scanId);
    // Update scan status to saved
    const updatedScans = fishScans.map(scan => 
      scan.id === scanId ? { ...scan, status: 'saved' } : scan
    );
    setFishScans(updatedScans);
    alert('Scan berhasil disimpan!');
  };

  const handleAddToCatalog = (scan) => {
    console.log('Add to catalog:', scan);
    // Navigate to catalog page with data
    alert('Navigasi ke halaman tambah katalog!');
    handleCloseModal();
  };

  const handleScanAction = (scanId, action) => {
    console.log(`${action} scan:`, scanId);
    // Implement actions (delete, favorite, rescan, etc.)
  };

  // Di HistoryContent.js
const sampleData = [
  {
    id: "FISH-2024-001",
    // ... properti lainnya
    fishData: {
      name: "Ikan emas fir'aun",
      // ... properti lainnya
      safety_percentage: 92 // Tambahkan ini
    }
  },
  // ... data lainnya
]

  return (
    <div className="history-content">
      <FilterTabs 
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        transactionCounts={{
          all: fishScans.length,
          consumable: fishScans.filter(s => s.fishData.konsumsi === 'Dapat dikonsumsi').length,
          ornamental: fishScans.filter(s => s.fishData.konsumsi === 'Tidak untuk konsumsi').length,
          saved: fishScans.filter(s => s.status === 'saved').length
        }}
      />
      
      <StatsOverview transactions={filteredScans} />
      
      <FishTransactionList 
        fishScans={filteredScans}
        onViewScan={handleViewScan}
        onScanAction={handleScanAction}
      />

      <FishScanDetailModal
        fishScan={selectedScan}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveScan}
        onAddToCatalog={handleAddToCatalog}
      />
    </div>
  );
}

export default HistoryContent;  