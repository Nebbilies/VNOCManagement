import { BrowserRouter, Routes, Route } from "react-router-dom";
import Staff from "./Pages/staff.tsx";
import Home from "./Pages/Home.tsx";
import Info from "./Pages/Info.tsx";
import Mappool from "./Pages/Mappool.tsx";

const url = new URL(
    "https://osu.ppy.sh/oauth/token"
);

const headers = {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
};

let body = "client_id=38468&client_secret=zJU5LqVOu6k5sadN6Ddg0aAAcXTMi8Vr7pea5MnW&grant_type=client_credentials&scope=public";

fetch(url, {
    method: "POST",
    headers,
    body: body,
}).then(response => {
    response.json();
    console.log(response);
}).then(data => {
    console.log(data);
});

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route index element={<Home />}/>
            <Route path="/staff" element={<Staff />} />
            <Route path={"/info"} element={<Info />} />
            <Route path={"/mappool"} element={<Mappool />} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
