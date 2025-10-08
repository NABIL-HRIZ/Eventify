import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/FilrageSection.css';
import { FaSearch } from "react-icons/fa";
const FilrageSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/evenements/categories');
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="filtrage-section">
      
      <div className="categories-buttons">
        {categories.map((cat, index) => (
          <button key={index} className="category-btn">
            {cat}
          </button>
        ))}
      </div>
      <div className='filtrage-input'>
        
        <input type="text" placeholder='Cherchez que vous voulez '/>
        <FaSearch style={{color:"white"}} />

      </div>
    </div>
  );
};

export default FilrageSection;
