import { Route, Routes } from "react-router";

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

import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/rooms"
            element={<Rooms />}
          />

          <Route
            path="/rooms/:id"
            element={<RoomDetails />}
          />

          <Route
            path="/experience"
            element={<Experience />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

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

          <Route
            path="*"
            element={<NotFound />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}