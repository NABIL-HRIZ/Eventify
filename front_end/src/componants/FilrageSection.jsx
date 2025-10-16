// src/components/FilrageSection.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/FilrageSection.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FilrageSection = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/evenements/categories");
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (cat) => {
    navigate(`/${cat.toLowerCase()}`);
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    navigate(`/event?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="filtrage-section">
      <div className="categories-buttons">
        {categories.map((cat, index) => (
          <button
            key={index}
            className="category-btn"
            onClick={() => handleCategoryClick(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filtrage-input">
        
        <input
          type="text"
          placeholder="Cherchez ce que vous voulez"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      
      </div>
    </div>
  );
};

export default FilrageSection;
