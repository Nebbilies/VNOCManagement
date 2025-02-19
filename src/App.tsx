import { BrowserRouter, Routes, Route } from "react-router-dom";
import Staff from "./Pages/staff.tsx";
import Home from "./Pages/Home.tsx";


function App() {


  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />}/>
            <Route path="/staff" element={<Staff />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
