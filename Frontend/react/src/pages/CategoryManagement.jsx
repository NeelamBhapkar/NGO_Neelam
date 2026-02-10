import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTrash, FaPlus, FaListAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const CategoryManagement = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch Categories on Load
  const fetchCategories = () => {
    fetch("http://localhost:5096/api/Admin/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add Category
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const response = await fetch("http://localhost:5096/api/Admin/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemName: newCategory }),
      });

      if (response.ok) {
        setNewCategory("");
        fetchCategories(); // Refresh list
        alert("Category added successfully!");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add category");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Handle Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`http://localhost:5096/api/Admin/delete-category/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories(); // Refresh list
      } else {
        alert("Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex align-items-center mb-4">
        <button className="btn btn-outline-secondary me-3" onClick={() => navigate('/admin-dashboard')}>
          <FaArrowLeft /> Back
        </button>
        <h2 className="mb-0 fw-bold text-dark">
           Donation Category Management
        </h2>
      </div>

      <div className="row g-4">
        
        {/* LEFT COLUMN: Add New Category Form */}
        <div className="col-md-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
              <FaPlus /> Add New Category
            </h5>
            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label small text-muted fw-bold">CATEGORY NAME</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Medical Aid" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100 fw-bold shadow-sm">
                Add Category
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT COLUMN: Categories List */}
        <div className="col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom-0 py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center gap-2 text-secondary">
                <FaListAlt /> Existing Categories
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 text-secondary small text-uppercase">ID</th>
                      <th className="px-4 py-3 text-secondary small text-uppercase w-100">Donation Category</th>
                      <th className="px-4 py-3 text-end text-secondary small text-uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="3" className="text-center p-4">Loading categories...</td></tr>
                    ) : categories.length === 0 ? (
                      <tr><td colSpan="3" className="text-center p-4 text-muted">No categories found in database.</td></tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.itemId}>
                          <td className="px-4 py-3 fw-bold text-muted">#{cat.itemId}</td>
                          <td className="px-4 py-3 fw-semibold text-dark">{cat.itemName}</td>
                          <td className="px-4 py-3 text-end">
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(cat.itemId)}
                              title="Delete Category"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CategoryManagement;