const MasterMedicine = require('../models/masterMedicineModel');
const Inventory = require('../models/medicineModel'); // Your inventory model


const searchMedicines = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.json([]); 
    }

    const regex = new RegExp(query, 'i');

    const inventorySearchPromise = Inventory.find({
      $or: [
        { medicineName: { $regex: regex } },
        { manufacturer: { $regex: regex } },
        { category: { $regex: regex } },
      ],
    }).limit(20).lean(); 

    
    const masterDbSearchPromise = MasterMedicine.find(
        { $text: { $search: query } },
        { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } }).limit(20).lean();
    
    
    const [inventoryResults, masterResults] = await Promise.all([
        inventorySearchPromise,
        masterDbSearchPromise
    ]);

    const combinedResults = new Map();

    inventoryResults.forEach(item => {
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

    
    masterResults.forEach(med => {
        const key = med.name.toLowerCase();
        if (combinedResults.has(key)) {
            const existing = combinedResults.get(key);
            existing.genericName = med.genericName;
            existing.indications = med.indications;
            existing.isRx = med.isRx;
        } else {
            combinedResults.set(key, {
                _id: med._id,
                name: med.name,
                genericName: med.genericName,
                indications: med.indications,
                isRx: med.isRx,
                category: med.category,
                price: null,
                stock: 0,
            });
        }
    });

    res.json(Array.from(combinedResults.values()));

  } catch (error) {
    console.error("Error in combined search:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};


const getAllInventoryMedicines = async (req, res) => {
  try {
    const inventoryItems = await Inventory.find({}).sort({ medicineName: 1 }).lean();

    const formattedResults = inventoryItems.map(item => ({
      _id: item._id,
      name: item.medicineName,
      genericName: 'N/A', 
      indications: 'N/A', 
      isRx: false,      
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