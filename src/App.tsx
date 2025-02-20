import { BrowserRouter, Routes, Route } from "react-router-dom";
import Staff from "./Pages/staff.tsx";
import Home from "./Pages/Home.tsx";
import Info from "./Pages/Info.tsx";

function App() {


  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />}/>
            <Route path="/staff" element={<Staff />} />
            <Route path={"/info"} element={<Info />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
