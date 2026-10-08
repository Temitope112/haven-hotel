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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

import AccountLayout from "./components/account/AccountLayout";
import AccountOverview from "./pages/account/AccountOverview";
import AccountBookings from "./pages/account/AccountBookings";
import AccountProfile from "./pages/account/AccountProfile";
import AccountSecurity from "./pages/account/AccountSecurity";
import Admin from "./pages/Admin";
import AdminBookings from "./pages/AdminBooking";
import AdminRooms from "./pages/AdminRooms";
import AdminUsers from "./pages/AdminUsers";

import AdminRoute from "./components/auth/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith("/admin");

  const isAccountRoute = location.pathname.startsWith("/account");

  const hidePublicLayout = isAdminRoute || isAccountRoute;

  return (
    <>
      {!hidePublicLayout && <Navbar />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/rooms" element={<Rooms />} />

          <Route path="/rooms/:id" element={<RoomDetails />} />

          <Route path="/experience" element={<Experience />} />

          <Route path="/about" element={<About />} />

          <Route path="/login" element={<Login />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/register" element={<Register />} />

          {/* GUEST DASHBOARD */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AccountOverview />} />

            <Route path="bookings" element={<AccountBookings />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="security" element={<AccountSecurity />} />
          </Route>

          {/* BOOKING DETAILS */}
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

      {!hidePublicLayout && <Footer />}
    </>
  );
}
