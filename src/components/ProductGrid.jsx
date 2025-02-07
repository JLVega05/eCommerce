import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import SidebarFilters from "./SidebarFilters";

const stripePromise = loadStripe("pk_test_51QSgAiBNoAIrMHfdrqMMFCgqvBXCJ9ymEpmjB0u8QzZUfrkNRN3DU1FEtI5Pe63YEgz5T3FwmpOvHpuR9hzGn0op00jZoKkROE");

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data); // Inicializa filteredProducts con todos los productos
      setLoading(false);
    };
    loadProducts();
  }, []);

  const handleBuyNow = async (product) => {
    const stripe = await stripePromise;

    try {
      const response = await fetch("http://localhost:3001/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              name: product.name,
              price: product.price,
              quantity: 1,
            },
          ],
          success_url: `${window.location.origin}/success`,
          cancel_url: `${window.location.origin}/cancel`,
        }),
      });

      const { sessionId } = await response.json();
      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error("Error al processar el pagament:", error);
      alert("No s'ha pogut completar el pagament.");
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", padding: "20px", width: "100%", minWidth: "400px" }}> {/* Ensure full width and minimum width */}
      <SidebarFilters products={products} setFilteredProducts={setFilteredProducts} />
      <Box sx={{ flexGrow: 1 }}>
        {filteredProducts.length === 0 ? (
          <Typography variant="h6" sx={{ textAlign: "center", marginTop: "20px" }}>
            No hi ha productes disponibles.
          </Typography>
        ) : (
          <Grid container spacing={3} justifyContent="center"> {/* Center the grid */}
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}> {/* Usa el ID como clave */}
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={product.imageURL}
                    alt={product.name}
                    sx={{
                      objectFit: "contain",
                    }}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="h6" sx={{ marginTop: "10px" }}>
                      €{product.price}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleBuyNow(product)}
                      sx={{ marginTop: "10px" }}
                    >
                      Comprar ara
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProductGrid;