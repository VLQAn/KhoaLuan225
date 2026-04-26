import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Register from "./pages/Register/Register";
import MovieList from "./pages/MovieList/MovieList";
import Deal from "./pages/Deal/Deal";
import Theater from "./pages/Theater/Theater";
import History from "./pages/History/History";
import Upcoming from "./pages/Upcoming/Upcoming";

import MainLayout from "./layout/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Những trang CÓ sidebar */}
        {/* <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
        </Route> */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/deals" element={<Deal />} />
          <Route path="/theaters" element={<Theater />} />
          <Route path="/history" element={<History />} />
          <Route path="/upcoming" element={<Upcoming />} />
        </Route>

        {/* Những trang KHÔNG có sidebar */}
        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;