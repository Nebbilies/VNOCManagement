import { BrowserRouter, Routes, Route } from "react-router-dom";
import Staff from "./Pages/staff.tsx";
import Home from "./Pages/Home.tsx";
import Info from "./Pages/Info.tsx";
import Mappool from "./Pages/Mappool.tsx";
import Players from "./Pages/Players.tsx";

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />}/>
            <Route path="/staff" element={<Staff />} />
            <Route path={"/info"} element={<Info />} />
            <Route path={"/mappool"} element={<Mappool />} />
            <Route path={"/players"} element={<Players />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
