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

import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/deals" element={<Deal />} />
          <Route path="/theaters" element={<Theater />} />
          <Route path="/history" element={<History />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/showtime/:id" element={<Showtime />} />
          <Route path="/seat/:maXuatChieu" element={<Seat />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/food/:maXuatChieu" element={<Food />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/review/:id" element={<Review />} />
        </Route>

        {/* Những trang KHÔNG có sidebar */}
        <Route path="/register" element={<Register />} />

        {/* Admin routes */}
        <Route path="/admin/home" element={<Ad_Home />} />
        <Route path="/admin/movie-manager" element={<MovieManager />} />
        <Route path="/admin/theater-manager" element={<TheaterManager />} />
        <Route path="/admin/showtime-manager" element={<ShowtimeManager />} />
        <Route path="/admin/food-manager" element={<FoodManager />} />
        <Route path="/admin/booking-manager" element={<BookingManager />} />
        <Route path="/admin/promotion-manager" element={<PromotionManager />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;