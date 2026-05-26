import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EnterNamePage from "@/pages/User/EnterNamePage";
import MenuPage from "@/pages/User/MenuPage";
import OrderPage from "@/pages/User/OrderPage";
import AdminPage from "@/pages/Admin/AdminPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EnterNamePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
