import React, { useState, useEffect } from "react";
import { Box, Slider, Typography, Checkbox, FormControlLabel, FormGroup } from "@mui/material";

const SidebarFilters = ({ products, setFilteredProducts }) => {
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Obtener todas las categorías únicas de los productos
  const categories = [...new Set(products.map(product => product.category))];

  // Efecto para filtrar los productos en tiempo real
  useEffect(() => {
    const filtered = products.filter(product => {
      // Normalizar el precio: eliminar comas y convertir a número
      const productPrice = parseFloat(product.price.replace(",", "."));

      // Filtro por rango de precios
      const withinPriceRange = productPrice >= priceRange[0] && productPrice <= priceRange[1];
      
      // Filtro por categorías (si no hay categorías seleccionadas, mostrar todos los productos)
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category || "Sin categoría");
      
      return withinPriceRange && matchesCategory;
    });
    
    setFilteredProducts(filtered);
  }, [priceRange, selectedCategories, products, setFilteredProducts]);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  return (
    <Box sx={{ width: 250, padding: "20px" }}>
      <Typography variant="h6" gutterBottom>
        Filtrar por Precio
      </Typography>
      <Slider
        value={priceRange}
        onChange={handlePriceChange}
        valueLabelDisplay="auto"
        min={0}
        max={2000}
        sx={{ marginBottom: "20px" }}
      />
      <Typography variant="h6" gutterBottom>
        Filtrar por Categoría
      </Typography>
      <FormGroup>
        {categories.map(category => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SidebarFilters;