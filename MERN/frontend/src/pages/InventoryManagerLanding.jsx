import React, { useState, useEffect } from "react";
import {
  getItems,
  createItem,
  getGrns,
  createGrn,
  deleteItem,
  updateItem,
  deleteGrn,
  updateGrn,
} from "../services/inventoryApi";
import LogoutButton from "../components/LogoutButton";
import "../styles/pages/inventoryManager.css";

function InventoryManagerLanding() {
  const [items, setItems] = useState([]);
  const [grns, setGrns] = useState([]);
  const [form, setForm] = useState({
    item_code: "",
    name: "",
    item_type: "RAW",
    standard_cost: "",
    uom: "KG",
  });
  const [grnForm, setGrnForm] = useState({
    grn_no: "",
    supplier: { name: "", email: "" },
    status: "DRAFT",
  });
  const [msg, setMsg] = useState("");

  // ✏️ Track edit mode
  const [editItemId, setEditItemId] = useState(null);
  const [editGrnId, setEditGrnId] = useState(null);

  useEffect(() => {
    loadItems();
    loadGrns();
  }, []);

  const loadItems = async () => {
    const data = await getItems();
    setItems(data || []);
  };

  const loadGrns = async () => {
    const data = await getGrns();
    setGrns(data || []);
  };

  // ---------------- Item handlers ----------------
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (editItemId) {
      // ✏️ Update
      const res = await updateItem(editItemId, form);
      if (res?._id) {
        setMsg("✅ Item updated successfully");
        setEditItemId(null);
        setForm({ item_code: "", name: "", item_type: "RAW", standard_cost: "", uom: "KG" });
        loadItems();
      } else setMsg("Failed to update item");
    } else {
      // ➕ Create
      const res = await createItem(form);
      if (res?._id) {
        setMsg("✅ Item created successfully");
        setForm({ item_code: "", name: "", item_type: "RAW", standard_cost: "", uom: "KG" });
        loadItems();
      } else setMsg(res?.message || "Failed to create item");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Item?")) return;
    const res = await deleteItem(id);
    setMsg(res?.message || "Item deleted");
    loadItems();
  };

  const handleEditItem = (item) => {
    setEditItemId(item._id);
    setForm({
      item_code: item.item_code,
      name: item.name,
      item_type: item.item_type,
      standard_cost: item.standard_cost,
      uom: item.uom,
    });
  };

  // ---------------- GRN handlers ----------------
  const onGrnChange = (e) =>
    setGrnForm({ ...grnForm, [e.target.name]: e.target.value });

  const onGrnSubmit = async (e) => {
    e.preventDefault();
    if (editGrnId) {
      const res = await updateGrn(editGrnId, grnForm);
      if (res?._id) {
        setMsg("✅ GRN updated successfully");
        setEditGrnId(null);
        setGrnForm({ grn_no: "", supplier: { name: "", email: "" }, status: "DRAFT" });
        loadGrns();
      } else setMsg("Failed to update GRN");
    } else {
      const res = await createGrn(grnForm);
      if (res?._id) {
        setMsg("✅ GRN created successfully");
        setGrnForm({ grn_no: "", supplier: { name: "", email: "" }, status: "DRAFT" });
        loadGrns();
      } else setMsg(res?.message || "Failed to create GRN");
    }
  };

  const handleDeleteGrn = async (id) => {
    if (!window.confirm("Are you sure you want to delete this GRN?")) return;
    const res = await deleteGrn(id);
    setMsg(res?.message || "GRN deleted");
    loadGrns();
  };

  const handleEditGrn = (grn) => {
    setEditGrnId(grn._id);
    setGrnForm({
      grn_no: grn.grn_no,
      supplier: { name: grn.supplier?.name || "", email: grn.supplier?.email || "" },
      status: grn.status,
    });
  };

  return (
    <div className="inv-wrap">
      <header className="inv-header">
        <h1>Inventory Manager Dashboard</h1>
        <LogoutButton />
      </header>

      {/* Add / Edit Item */}
      <section className="card">
        <h2>{editItemId ? "Edit Item" : "Add New Item"}</h2>
        {msg && <div className="info">{msg}</div>}
        <form className="grid" onSubmit={onSubmit}>
          <input name="item_code" placeholder="Item Code" value={form.item_code} onChange={onChange} required />
          <input name="name" placeholder="Item Name" value={form.name} onChange={onChange} required />
          <select name="item_type" value={form.item_type} onChange={onChange}>
            <option value="RAW">RAW</option>
            <option value="WIP">WIP</option>
            <option value="FG">Finished Good</option>
            <option value="MRO">MRO</option>
            <option value="PACKAGING">Packaging</option>
          </select>
          <input name="standard_cost" type="number" placeholder="Cost" value={form.standard_cost} onChange={onChange} />
          <input name="uom" placeholder="Unit (e.g., KG, PCS)" value={form.uom} onChange={onChange} />
          <button type="submit">{editItemId ? "Update Item" : "Add Item"}</button>
        </form>
      </section>

      {/* Items */}
      <section className="card">
        <h2>Items Master</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Type</th>
              <th>Cost</th>
              <th>UOM</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((i) => (
                <tr key={i._id}>
                  <td>{i.item_code}</td>
                  <td>{i.name}</td>
                  <td>{i.item_type}</td>
                  <td>{i.standard_cost}</td>
                  <td>{i.uom}</td>
                  <td>
                    <button onClick={() => handleEditItem(i)}>Edit</button>
                    <button onClick={() => handleDeleteItem(i._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Add / Edit GRN */}
      <section className="card">
        <h2>{editGrnId ? "Edit GRN" : "Add GRN"}</h2>
        <form onSubmit={onGrnSubmit} className="grid">
          <input name="grn_no" placeholder="GRN Number" value={grnForm.grn_no} onChange={onGrnChange} required />
          <input name="supplier.name" placeholder="Supplier Name" value={grnForm.supplier.name} 
            onChange={(e) => setGrnForm({...grnForm, supplier: {...grnForm.supplier, name: e.target.value}})} required />
          <input name="supplier.email" placeholder="Supplier Email" value={grnForm.supplier.email}
            onChange={(e) => setGrnForm({...grnForm, supplier: {...grnForm.supplier, email: e.target.value}})} required />
          <select name="status" value={grnForm.status} onChange={onGrnChange}>
            <option value="DRAFT">DRAFT</option>
            <option value="POSTED">POSTED</option>
          </select>
          <button type="submit">{editGrnId ? "Update GRN" : "Add GRN"}</button>
        </form>

        <table className="users-table">
          <thead>
            <tr>
              <th>GRN No</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {grns.length > 0 ? (
              grns.map((g) => (
                <tr key={g._id}>
                  <td>{g.grn_no}</td>
                  <td>{g.supplier?.name}</td>
                  <td>{g.grn_date ? new Date(g.grn_date).toLocaleDateString() : "-"}</td>
                  <td>{g.status}</td>
                  <td>
                    <button onClick={() => handleEditGrn(g)}>Edit</button>
                    <button onClick={() => handleDeleteGrn(g._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No GRNs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default InventoryManagerLanding;
