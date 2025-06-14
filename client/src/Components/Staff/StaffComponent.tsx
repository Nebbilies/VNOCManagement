import StaffGrid from "./StaffGrid.tsx";
import {AddStaffButton} from "./AddStaffButton.tsx";
import {useState, useEffect} from "react";
import {Loading} from "../Utility/Loading.tsx";
import {useUser} from "../../context/UserContext.tsx";

export const roles = [
    "Admin",
    "Referee",
    "Mappooler",
    "Streamer",
    "Commentator",
]

export interface Staff {
    Id: number;
    Username: string;
    Role: string;
}


//Interface for staff

function StaffComponent() {
    const {user} = useUser();
    let userRole = "";
    if (user) {
        userRole = user.role;
    }
    const apiBase = import.meta.env.VITE_API_BASE_URL
    const [staff, setStaff] = useState<Staff[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(() => {
        fetch(`${apiBase}/staff/all`, {
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch staff");
                return res.json();
            })
            .then((data) => setStaff(data))
            .catch((error) => console.error("Error fetching staff:", error));
        setRefresh(false);
        setLoading(false);
    }, [refresh]);
    return (
        <div className={"mappool-container flex flex-col items-center max-w-screen h-auto px-4 lg:px-8 " +
            "mt-20 lg:mt-40 mb-20 pt-10 pb-10 md:mx-16 lg:mx-36 xl:mx-64 mx-8 self-center text-white bg-gray-900/50 rounded-3xl"}>
            <div className={"flex w-full justify-between items-center h-20"}>
                <h1 className={"lg:text-6xl text-5xl font-black"}>Staff</h1>
                {userRole === "ADMIN" &&
                    <AddStaffButton toggleRefresh={setRefresh} />
                }
            </div>
            <div className={"h-1 w-1/2 border-2 border-white rounded-2xl mt-10"}></div>
                <div className={'w-full flex flex-col items-center justify-center'}>
                    {loading ? (
                            <Loading/>
                        ) :
                        roles.map(role => (
                                <div key={role} className={"flex flex-col w-full items-start justify-center mt-8"}>
                                    <h2 className={"text-4xl font-bold"}>{role}</h2>
                                    <div className={"flex flex-col w-full items-start justify-center mt-5"}>
                                        <StaffGrid staffList={staff.filter(staff => staff.Role === role.toUpperCase())}
                                                    toggleRefresh={setRefresh}
                                        />
                                    </div>
                                </div>
                            ))
                        }
                </div>
            </div>
    )
}

            export default StaffComponent