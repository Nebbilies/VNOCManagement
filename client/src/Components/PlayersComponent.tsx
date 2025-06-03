import PlayersGrid from "./PlayersGrid.tsx";
import {useEffect, useState} from "react";

export interface Player {
    Id: number,
    Username: string,
    Rank: number,
}

export type PlayerData = Player[]

function PlayersComponent() {
    const [playerData, setPlayerData] = useState<PlayerData>([]);
    const [playerSearch, setPlayerSearch] = useState("")
    const [filteredPlayerData, setFilteredPlayerData] = useState<PlayerData>(playerData)
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        fetch("http://localhost:3001/api/players/all", {
        })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch players");
                return res.json();
            })
            .then((data) => {
                setPlayerData(data);
                setFilteredPlayerData(data);
            })
            .catch((error) => {
                console.error("Error fetching players:", error);
            });
        setRefresh(false);
        }, [refresh]);
    useEffect(() => {
        const filteredData =
            playerData.filter((player) =>
                player.Username.toLowerCase().includes(playerSearch.toLowerCase())
                || player.Id.toString().includes(playerSearch)
            );
        setFilteredPlayerData(filteredData);
    }, [playerSearch]);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerSearch(event.target.value);
    };
    return (
        <div className={"mappool-container flex flex-col items-center max-w-screen h-auto px-4 lg:px-8 " +
            "mt-20 lg:mt-40 mb-20 pt-10 pb-10 md:mx-12 lg:mx-28 xl:mx-40 mx-4 self-center text-white bg-gray-900/50 rounded-3xl"}>
            <div className={"mappool-header flex flex-col w-full lg:text-5xl md:text-4xl text-3xl font-black items-center justify-center"}>
                <div className={"mappool-header-text w-full italic text-center"}>
                    PLAYERS LIST
                </div>
                <div className={"mappool-search-form w-full text-center mt-3"}>
                    <input type="text" placeholder={"Search..."}
                            value={playerSearch}
                            onChange={handleSearchChange}
                           className={"bg-gray-900/80 rounded-lg p-2 text-lg font-medium text-white placeholder:text-gray-400 border-3 border-[#353d60] rounded-[5px]"}/>
                </div>
            </div>
            <div className={"h-1 w-1/2 border-2 border-white rounded-2xl mt-10"}>
            </div>
            <PlayersGrid playerData={filteredPlayerData} toggleRefresh={setRefresh}/>

        </div>
    )
}

export default PlayersComponent