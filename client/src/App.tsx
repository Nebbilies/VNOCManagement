import { BrowserRouter, Routes, Route } from "react-router-dom";
import Staff from "./Pages/Staff.tsx";
import Home from "./Pages/Home.tsx";
import Info from "./Pages/Info.tsx";
import Mappool from "./Pages/Mappool.tsx";
import Players from "./Pages/Players.tsx";
import Matches from "./Pages/Matches.tsx";
import Header from "./Components/Header.tsx";
import {ToastProvider} from "./context/ToastContext.tsx";

function App() {
  return (
      <>
          <ToastProvider>
              <BrowserRouter>
                  <Header/>
                  <Routes>
                      <Route index element={<Home/>}/>
                      <Route path="/staff" element={<Staff/>}/>
                      <Route path={"/info"} element={<Info/>}/>
                      <Route path={"/mappool"} element={<Mappool/>}/>
                      <Route path={"/players"} element={<Players/>}/>
                      <Route path={"/matches"} element={<Matches/>}/>
                  </Routes>
              </BrowserRouter>
          </ToastProvider>
      </>
  )
}

export default App
