import TopHeader from "./TopHeader.tsx";
import SidebarHeader from "./SidebarHeader.tsx";
import logo from "../assets/logo.png";

const links = [
    {name: "Staff", path: "/staff"},
    {name: "Info", path: "/info"},
    {name: "Players", path: "/players"},
    {name: "Mappool", path: "/mappool"},
    {name: "Matches", path: "/matches"},
]

function Header() {
    return (
        <>
            <TopHeader links={links} logo={logo}/>
            <SidebarHeader links={links} logo={logo}/>
        </>
    )
}
export default Header;