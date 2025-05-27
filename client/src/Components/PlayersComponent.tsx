import PlayersGrid from "./PlayersGrid.tsx";
import {useEffect, useState} from "react";

export interface Player {
    id: number,
    username: string,
    globalRanking: number,
}

export type PlayerData = Player[]

let playerData: PlayerData = [
    {
        id: 10635981,
        username: "- Nebby -",
        globalRanking: 2903,
    },
    {
        id: 7696512,
        username: "Hoaq",
        globalRanking: 2903,
    },
    {
        id: 12561202,
        username: "TKieen",
        globalRanking: 29038,
    },
    {
        id: 14047619,
        username: "Zeigler",
        globalRanking: 831,
    },
    {
        id: 12345678,
        username: "Player1",
        globalRanking: 1000,
    },
    {
        id: 87654321,
        username: "Player2",
        globalRanking: 2000,
    },
    {
        id: 13579246,
        username: "Player3",
        globalRanking: 3000,
    },
    {
        id: 24681357,
        username: "Player4",
        globalRanking: 4000,
    },
]


function PlayersComponent() {
    const [playerSearch, setPlayerSearch] = useState("")
    const [filteredPlayerData, setFilteredPlayerData] = useState<PlayerData>(playerData)
    useEffect(() => {
        const filteredData =
            playerData.filter((player) =>
                player.username.toLowerCase().includes(playerSearch.toLowerCase())
                || player.id.toString().includes(playerSearch)
            );
        setFilteredPlayerData(filteredData);
    }, [playerSearch]);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPlayerSearch(event.target.value);
    };
    return (
        <div className={"mappool-container flex flex-col items-center max-w-screen h-auto px-4 lg:px-8 " +
            "mt-40 mb-20 pt-10 pb-10 md:mx-12 lg:mx-28 xl:mx-40 mx-4 self-center text-white bg-gray-900/50 rounded-3xl"}>
            <div className={"mappool-header flex flex-col w-full lg:text-5xl md:text-4xl text-3xl font-black items-center justify-center"}>
                <div className={"mappool-header-text w-full italic text-center"}>
                    DANH SÁCH NGƯỜI CHƠI
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
            <PlayersGrid playerData={filteredPlayerData}/>

        </div>
    )
}

export default PlayersComponent