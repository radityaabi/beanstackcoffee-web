import { BrowserRouter, Route, Routes } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider } from "./modules/auth/context";
import ScrollToTop from "./components/layout/ScrollToTop";

import { HomeRoute } from "./routes/home";
import { ProductsRoute } from "./routes/products";
import { ProductDetailRoute } from "./routes/product-detail";
import { CartRoute } from "./routes/cart";
import { LoginRoute } from "./routes/login";
import { RegisterRoute } from "./routes/register";
import { DashboardRoute } from "./routes/dashboard";

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/register" element={<RegisterRoute />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomeRoute />} />
            <Route path="/dashboard" element={<DashboardRoute />} />
            <Route path="/products" element={<ProductsRoute />} />
            <Route path="/products/:slug" element={<ProductDetailRoute />} />
            <Route path="/cart" element={<CartRoute />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
