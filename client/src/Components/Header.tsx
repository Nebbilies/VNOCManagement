import TopHeader from "./TopHeader.tsx";
import SidebarHeader from "./SidebarHeader.tsx";
import logo from "../assets/logo.png";
import {useEffect} from "react";
import {useUser} from "../context/UserContext.tsx";
const apiBase = import.meta.env.VITE_API_BASE_URL
const links = [
    {name: "Home", path: "/"},
    {name: "Staff", path: "/staff"},
    {name: "Info", path: "/info"},
    {name: "Players", path: "/players"},
    {name: "Mappool", path: "/mappool"},
    {name: "Matches", path: "/matches"},
]

export const handleLogOut = () => {
    window.localStorage.removeItem("user");
    window.location.href = `${apiBase}/auth/logout`;
}

function Header() {
    const { setUser } = useUser()
    useEffect(() => {
        fetch(`${apiBase}/auth/me`, {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => setUser(data))
            .catch(() => setUser(null));
    }, []);
    return (
        <>
            <TopHeader links={links} logo={logo}/>
            <SidebarHeader links={links} logo={logo}/>
        </>
    )
}
export default Header;