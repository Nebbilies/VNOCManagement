import PlayersGrid from "./PlayersGrid.tsx";
import {useEffect, useState} from "react";

export type playerData = Record<string, { username: string, globalRanking: number }>

let playerData: playerData = {
    "10635981": {
        "username": "- Nebby -",
        "globalRanking": 2903,
    },
    "12931959": {
        "username": "aaa",
        "globalRanking": 2903,
    },
    "12931932": {
        "username": "aab",
        "globalRanking": 29038,
    },
    "12931238": {
        "username": "baba",
        "globalRanking": 831,
    },
    "13489359": {
        "username": "Nick",
        "globalRanking": 2109831,
    },
    "12930293": {
        "username": "Ben",
        "globalRanking": 299831,
    },
    "12931483": {
        "username": "Rachel",
        "globalRanking": 29831,
    },
    "2": {
        "username": "peppy",
        "globalRanking": 2903,
    },
    "3": {
        "username": "Dean Herbert",
        "globalRanking": 21,
    },
    "4452992": {
        "username": "Astra",
        "globalRanking": 2903,
    },
    "854439": {
        "username": "Hoang",
        "globalRanking": 2903,
    },
    "1200123": {
        "username": "Vivian",
        "globalRanking": 29038,
    },
    "1212138": {
        "username": "Kiana",
        "globalRanking": 831,
    },
    "9587896": {
        "username": "Herta",
        "globalRanking": 2109831,
    },
    "1121532": {
        "username": "a",
        "globalRanking": 299831,
    },
    "1071483": {
        "username": "Salt",
        "globalRanking": 29831,
    },
    "11149940": {
        "username": "Acid",
        "globalRanking": 2903,
    },
    "968942": {
        "username": "Belle",
        "globalRanking": 21,
    },
}

function PlayersComponent() {
    const [playerSearch, setPlayerSearch] = useState("")
    const [filteredPlayerData, setFilteredPlayerData] = useState<playerData>(playerData)
    useEffect(() => {
        const filteredData = Object.fromEntries(
            Object.entries(playerData).filter(([id, player]) =>
                player.username.toLowerCase().includes(playerSearch.toLowerCase())
            )
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