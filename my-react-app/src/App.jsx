import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import MovieList from "./pages/MovieList/MovieList";
import Deal from "./pages/Deal/Deal";
import Theater from "./pages/Theater/Theater";
import History from "./pages/History/History";
import Upcoming from "./pages/Upcoming/Upcoming";
import MovieDetail from "./pages/MovieDetail/MovieDetail";
import Showtime from "./pages/Showtime/Showtime";
import Seat from "./pages/Seat/Seat";
import Checkout from "./pages/Checkout/Checkout";
import Food from "./pages/Food/Food";
import Ad_Home from "./Admin/Home/Home";
import MovieManager from "./Admin/ManagerFilm/MovieManager";
import TheaterManager from "./Admin/ManagerTheater/TheaterManager";
import ShowtimeManager from "./Admin/ManagerShowtime/ShowtimeManager";
import FoodManager from "./Admin/Food/FoodManager";
import BookingManager from "./Admin/Booking/BookingManager";
import PromotionManager from "./Admin/Promotion/PromotionManager";
import Profile from "./pages/Profile/Profile";
import Review from "./pages/Review/Review";
import AdminRoute from "./routes/AdminRoute";
import CustomerRoute from "./routes/CustomerRoute";

import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={
            <CustomerRoute>
              <Home />
            </CustomerRoute>
          } />

          <Route path="/movies" element={
            <CustomerRoute>
              <MovieList />
            </CustomerRoute>
          } />

          <Route path="/deals" element={
            <CustomerRoute>
              <Deal />
            </CustomerRoute>
          } />

          <Route path="/theaters" element={
            <CustomerRoute>
              <Theater />
            </CustomerRoute>
          } />

          <Route path="/history" element={
            <CustomerRoute>
              <History />
            </CustomerRoute>
          } />

          <Route path="/upcoming" element={
            <CustomerRoute>
              <Upcoming />
            </CustomerRoute>
          } />

          <Route path="/movie/:id" element={
            <CustomerRoute>
              <MovieDetail />
            </CustomerRoute>
          } />

          <Route path="/showtime/:id" element={
            <CustomerRoute>
              <Showtime />
            </CustomerRoute>
          } />

          <Route
            path="/seat/:maXuatChieu"
            element={
              <CustomerRoute>
                <Seat />
              </CustomerRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <CustomerRoute>
                <Checkout />
              </CustomerRoute>
            }
          />

          <Route
            path="/food/:maXuatChieu"
            element={
              <CustomerRoute>
                <Food />
              </CustomerRoute>
            }
          />

          <Route path="/profile" element={
            <CustomerRoute>
              <Profile />
            </CustomerRoute>
          } />

          <Route path="/review/:id" element={
            <CustomerRoute>
              <Review />
            </CustomerRoute>
          } />
        </Route>

        {/* Những trang KHÔNG có sidebar */}
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route
          path="/admin/home"
          element={
            <AdminRoute>
              <Ad_Home />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/movie-manager"
          element={
            <AdminRoute>
              <MovieManager />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/theater-manager"
          element={
            <AdminRoute>
              <TheaterManager />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/showtime-manager"
          element={
            <AdminRoute>
              <ShowtimeManager />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/food-manager"
          element={
            <AdminRoute>
              <FoodManager />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/booking-manager"
          element={
            <AdminRoute>
              <BookingManager />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/promotion-manager"
          element={
            <AdminRoute>
              <PromotionManager />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;