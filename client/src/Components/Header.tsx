import TopHeader from "./TopHeader.tsx";
import SidebarHeader from "./SidebarHeader.tsx";
import logo from "../assets/logo.png";
import {useEffect} from "react";
import {useUser} from "../context/UserContext.tsx";

const links = [
    {name: "Staff", path: "/staff"},
    {name: "Info", path: "/info"},
    {name: "Players", path: "/players"},
    {name: "Mappool", path: "/mappool"},
    {name: "Matches", path: "/matches"},
]

function Header() {
    const { setUser } = useUser()
    useEffect(() => {
        fetch("http://localhost:3001/api/auth/me", {
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