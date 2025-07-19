import React from 'react';
import { 
  FiBarChart2, FiFileText, FiArchive, FiDollarSign, 
  FiLink, FiSearch, FiFilter, FiChevronDown, FiCheckCircle 
} from 'react-icons/fi';
import Header from '../components/Header'; // Adjust path as needed
// Assuming you have a CSS file for styles

// ✅ Sample mock search data
const searchResults = [
  {
    name: "Paracetamol",
    genericName: "Acetaminophen",
    tags: [
      { text: "Pain Relief", type: "category" },
      { text: "In Stock", type: "status" }
    ],
    indications: "Fever, mild to moderate pain",
    price: "24.50",
    stock: "Available: 52 strips",
    isRx: false
  },
  {
    name: "Amoxicillin",
    genericName: "Amoxicillin Trihydrate",
    tags: [
      { text: "Antibiotic", type: "category" },
      { text: "Prescription", type: "warning" },
      { text: "In Stock", type: "status" }
    ],
    indications: "Bacterial infections",
    price: "45.00",
    stock: "Available: 30 boxes",
    isRx: true
  }
];

const MedicineDB = () => {
  return (
    <div className="w-full h-screen bg-slate-50 font-sans ">
      <Header />

      {/* Navigation Tabs */}
      <nav className="px-4 pt-4">
        <div className="bg-white p-2 rounded-lg shadow-sm flex items-center space-x-2">
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100">
            <FiBarChart2 className="mr-2" /> Dashboard
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100">
            <FiFileText className="mr-2" /> Symptom Analysis
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100">
            <FiArchive className="mr-2" /> Inventory
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100">
            <FiDollarSign className="mr-2" /> Revenue
          </button>
          <button className="flex items-center justify-center w-full px-4 py-2 text-slate-600 rounded-md hover:bg-slate-100">
            <FiLink className="mr-2" /> Medicine DB
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4">
        {/* Medicine Search */}
        <section className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center mb-4">
            <FiLink className="h-7 w-7 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Medicine Database</h2>
              <p className="text-slate-500">Search and explore comprehensive medicine information and inventory</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative flex-grow">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by medicine name, generic name, or indication..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center px-4 py-3 text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
              <FiFilter className="mr-2 text-slate-500" />
              All Categories
              <FiChevronDown className="ml-2 text-slate-500" />
            </button>
          </div>
        </section>

        {/* Search Results */}
        <section className="bg-white p-6 mt-4 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Search Results ({searchResults.length})</h2>
          <div className="space-y-4">
            {searchResults.map((med, index) => (
              <MedicineResultItem key={index} medicine={med} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

const MedicineResultItem = ({ medicine }) => (
  <div className="border border-slate-200 rounded-lg p-5 hover:border-blue-500 hover:bg-slate-50 transition-colors">
    <div className="flex justify-between items-start">
      <div>
        <div className="flex items-center mb-1">
          <h3 className="text-xl font-bold text-slate-800">{medicine.name}</h3>
          {medicine.isRx && (
            <span className="ml-3 text-xs font-semibold text-slate-600 bg-slate-200 px-2 py-0.5 rounded-md">Rx</span>
          )}
        </div>
        <p className="text-slate-500 mb-3">{medicine.genericName}</p>
        <div className="flex items-center flex-wrap gap-2 mb-3">
          {medicine.tags.map((tag, index) => (
            <Tag key={index} text={tag.text} type={tag.type} />
          ))}
        </div>
        <p className="text-sm text-slate-600"><span className="font-semibold">Indications:</span> {medicine.indications}</p>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        <p className="text-xl font-bold text-green-600">₹{medicine.price}</p>
        <p className="text-sm text-slate-500">{medicine.stock}</p>
      </div>
    </div>
  </div>
);

const Tag = ({ text, type }) => {
  const baseClasses = "text-xs font-semibold px-3 py-1 rounded-full flex items-center";
  let typeClasses = "";

  switch (type) {
    case 'status':
      typeClasses = "bg-slate-800 text-white";
      break;
    case 'warning':
      typeClasses = "bg-yellow-100 text-yellow-800";
      break;
    case 'category':
    default:
      typeClasses = "bg-slate-200 text-slate-700";
      break;
  }

  return (
    <span className={`${baseClasses} ${typeClasses}`}>
      {type === 'status' && text === "In Stock" && <FiCheckCircle className="mr-1.5" />}
      {text}
    </span>
  );
};

export default MedicineDB;
