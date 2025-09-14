import Item from "../models/Item.js";

// ✅ Get all items
export const getItems = async (_req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch items" });
  }
};

// ✅ Create item
export const createItem = async (req, res) => {
  try {
    const { item_code, name, item_type, standard_cost, uom } = req.body;

    const exist = await Item.findOne({ item_code });
    if (exist) return res.status(400).json({ message: "Item code already exists" });

    const item = await Item.create({ item_code, name, item_type, standard_cost, uom });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to create item" });
  }
};
