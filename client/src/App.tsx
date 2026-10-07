import { Route, Routes, useLocation } from "react-router";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import RoomDetails from "./pages/RoomDetails";
import BookingDetails from "./pages/BookingDetails";
import Experience from "./pages/Experience";
import About from "./pages/About";
import Login from "./pages/login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminBookings from "./pages/AdminBooking";
import AdminRooms from "./pages/AdminRooms";

import AdminRoute from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminUsers from "./pages/AdminUsers";
export default function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/rooms" element={<Rooms />} />

          <Route path="/rooms/:id" element={<RoomDetails />} />

          <Route path="/experience" element={<Experience />} />

          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookings/:id"
            element={
              <ProtectedRoute>
                <BookingDetails />
              </ProtectedRoute>
            }
          />

          {/* ADMIN AREA */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Admin />} />

            <Route path="bookings" element={<AdminBookings />} />

            <Route path="rooms" element={<AdminRooms />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </>
  );
}
