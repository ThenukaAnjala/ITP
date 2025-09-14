// src/pages/InventoryManagerLanding.jsx
import React, { useState, useEffect } from "react";
import { getItems, createItem, getGrns, createGrn } from "../services/inventoryApi";
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
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadItems();
    loadGrns();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getItems();
      setItems(data || []);
    } catch (err) {
      console.error("Failed to load items:", err);
    }
  };

  const loadGrns = async () => {
    try {
      const data = await getGrns();
      setGrns(data || []);
    } catch (err) {
      console.error("Failed to load GRNs:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = await createItem(form);
    if (res?._id) {
      setMsg("✅ Item created successfully");
      setForm({ item_code: "", name: "", item_type: "RAW", standard_cost: "", uom: "KG" });
      loadItems();
    } else {
      setMsg(res?.message || "Failed to create item");
    }
  };

  return (
    <div className="inv-wrap">
      <header className="inv-header">
        <h1>Inventory Manager Dashboard</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Register new item */}
      <section className="card">
        <h2>Add New Item</h2>
        {msg && <div className="info">{msg}</div>}
        <form className="grid" onSubmit={onSubmit}>
          <input
            name="item_code"
            placeholder="Item Code"
            value={form.item_code}
            onChange={onChange}
            required
          />
          <input
            name="name"
            placeholder="Item Name"
            value={form.name}
            onChange={onChange}
            required
          />
          <select name="item_type" value={form.item_type} onChange={onChange}>
            <option value="RAW">RAW</option>
            <option value="WIP">WIP</option>
            <option value="FG">Finished Good</option>
            <option value="MRO">MRO</option>
            <option value="PACKAGING">Packaging</option>
          </select>
          <input
            name="standard_cost"
            type="number"
            placeholder="Cost"
            value={form.standard_cost}
            onChange={onChange}
          />
          <input
            name="uom"
            placeholder="Unit (e.g., KG, PCS)"
            value={form.uom}
            onChange={onChange}
          />
          <button type="submit">Add Item</button>
        </form>
      </section>

      {/* Items list */}
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No items found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* GRN list */}
      <section className="card">
        <h2>Recent GRNs</h2>
        <table className="users-table">
          <thead>
            <tr>
              <th>GRN No</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {grns.length > 0 ? (
              grns.map((g) => (
                <tr key={g._id}>
                  <td>{g.grn_no}</td>
                  <td>{g.supplier?.name}</td>
                  <td>{new Date(g.grn_date).toLocaleDateString()}</td>
                  <td>{g.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No GRNs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default InventoryManagerLanding;
