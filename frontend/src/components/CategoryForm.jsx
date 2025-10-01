import { useState } from "react";

const CategoryForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");

  const categories = {
    Bakal: ["Solid A", "Solid B", "Light"],
    Plastic: ["PET", "HDPE", "LDPE"],
    Paper: ["Carton", "White", "Mixed"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd?.({
      name,
      quantity: qty,
      unit,
      unitPrice: price,
      mainCategory,
      subCategory,
    });
    setName("");
    setQty("");
    setPrice("");
    setMainCategory("");
    setSubCategory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4"
    >
      <input
        type="text"
        placeholder="Item name"
        className="border p-2 rounded w-48"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Qty"
        className="border p-2 rounded w-24"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
        required
      />
      <select
        className="border p-2 rounded"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      >
        <option value="kg">kg</option>
        <option value="pcs">pcs</option>
      </select>
      <input
        type="number"
        placeholder="Price"
        className="border p-2 rounded w-28"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <select
        className="border p-2 rounded"
        value={mainCategory}
        onChange={(e) => {
          setMainCategory(e.target.value);
          setSubCategory("");
        }}
        required
      >
        <option value="">Main Category</option>
        {Object.keys(categories).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        className="border p-2 rounded"
        value={subCategory}
        onChange={(e) => setSubCategory(e.target.value)}
        required
        disabled={!mainCategory}
      >
        <option value="">Sub Category</option>
        {mainCategory &&
          categories[mainCategory].map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </form>
  );
};

export default CategoryForm;