const MasterMedicine = require('../models/masterMedicineModel');
const Inventory = require('../models/medicineModel'); // Your inventory model

// @desc    Search both the inventory and master medicine database
// @route   GET /api/medicines/search?q=your_query
// @access  Public
const searchMedicines = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]); // Return empty if no query
    }

    // Create a regex for case-insensitive searching
    const regex = new RegExp(query, 'i');

    // --- Step 1: Search your current inventory ---
    // Search by medicine name, manufacturer, or category
    const inventorySearchPromise = Inventory.find({
      $or: [
        { medicineName: { $regex: regex } },
        { manufacturer: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    }).limit(20).lean(); // .lean() for faster read-only operations

    // --- Step 2: Search the master medicine database ---
    const masterDbSearchPromise = MasterMedicine.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(20).lean();
    
    // --- Step 3: Execute both searches in parallel ---
    const [inventoryResults, masterResults] = await Promise.all([
        inventorySearchPromise,
        masterDbSearchPromise
    ]);

    // --- Step 4: Combine and de-duplicate results ---
    const combinedResults = new Map();

    // First, process results from your live inventory
    inventoryResults.forEach(item => {
        // This structure matches what the frontend expects
        const result = {
          _id: item._id, // Use inventory ID
          name: item.medicineName,
          genericName: 'N/A', // Default value, can be enriched later
          indications: 'N/A', // Default value
          isRx: false, // Default value
          category: item.category,
          price: item.price,
          stock: item.quantity,
        };
        combinedResults.set(item.medicineName.toLowerCase(), result);
    });

    // Next, process results from the master DB to enrich or add new entries
    masterResults.forEach(med => {
        const key = med.name.toLowerCase();
        if (combinedResults.has(key)) {
            // If already present from inventory, just enrich it with master data
            const existing = combinedResults.get(key);
            existing.genericName = med.genericName;
            existing.indications = med.indications;
            existing.isRx = med.isRx;
        } else {
            // If not in inventory, add it as an out-of-stock item
            combinedResults.set(key, {
                _id: med._id,
                name: med.name,
                genericName: med.genericName,
                indications: med.indications,
                isRx: med.isRx,
                category: med.category,
                price: null, // Not in inventory, so no price
                stock: 0,    // Not in inventory, so 0 stock
            });
        }
    });

    res.json(Array.from(combinedResults.values()));

  } catch (error) {
    console.error("Error in combined search:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    (Optional) Add a new medicine to the master DB
// @route   POST /api/medicines/add
// @access  Protected
const getAllInventoryMedicines = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({}).sort({ medicineName: 1 }).lean();

    // Transform the data to match the structure expected by the MedicineDB component
    const formattedResults = inventoryItems.map(item => ({
      _id: item._id,
      name: item.medicineName,
      genericName: 'N/A', // Inventory items might not have this detail
      indications: 'N/A', // This detail is in the master DB
      isRx: false,      // Default value
      category: item.category,
      price: item.price,
      stock: item.quantity,
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Error fetching all inventory medicines:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};


const addMasterMedicine = async (req, res) => {
    try {
        const newMed = new MasterMedicine(req.body);
        const savedMed = await newMed.save();
        res.status(201).json(savedMed);
    } catch (error) {
        res.status(400).json({ message: "Error adding medicine", error });
    }
};

module.exports = { searchMedicines, addMasterMedicine, getAllInventoryMedicines };