import PlayersGrid from "./PlayersGrid.tsx";

interface Props {

}

export type playerData = Record<string, { username: string, globalRanking: number }>

let playerData: playerData = {
    "10635981": {
        "username": "- Nebby -",
        "globalRanking": 2903,
    },
    "12931959": {
        "username": "thang random nao do lmao",
        "globalRanking": 2903,
    },
    "12931932": {
        "username": "thang random nao do lmao",
        "globalRanking": 29038,
    },
    "12931238": {
        "username": "thang random nao do lmao",
        "globalRanking": 831,
    },
    "13489359": {
        "username": "thang random nao do lmao",
        "globalRanking": 2109831,
    },
    "12930293": {
        "username": "a",
        "globalRanking": 299831,
    },
    "12931483": {
        "username": "thang random nao do lmao",
        "globalRanking": 29831,
    },
    "7562902": {
        "username": "thang random nao do lmao",
        "globalRanking": 2903,
    },
    "7696512": {
        "username": "thang random nao do lmao",
        "globalRanking": 21,
    },
    "234341": {
        "username": "aaa",
        "globalRanking": 2903,
    },
    "854439": {
        "username": "thang random nao do lmao",
        "globalRanking": 2903,
    },
    "1200123": {
        "username": "thang random nao do lmao",
        "globalRanking": 29038,
    },
    "1212138": {
        "username": "thang random nao do lmao",
        "globalRanking": 831,
    },
    "13489539": {
        "username": "thang random nao do lmao",
        "globalRanking": 2109831,
    },
    "1121532": {
        "username": "a",
        "globalRanking": 299831,
    },
    "1071483": {
        "username": "thang random nao do lmao",
        "globalRanking": 29831,
    },
    "11149940": {
        "username": "thang random nao do lmao",
        "globalRanking": 2903,
    },
    "968942": {
        "username": "thang random nao do lmao",
        "globalRanking": 21,
    },
}

function PlayersComponent() {
    return (
        <div className={"mappool-container flex flex-col items-center max-w-screen h-auto px-4 lg:px-8 " +
            "mt-40 mb-20 pt-10 pb-10 md:mx-12 lg:mx-28 xl:mx-40 mx-4 self-center text-white bg-gray-900/50 rounded-3xl"}>
            <div className={"mappool-header flex w-full lg:text-5xl md:text-4xl text-3xl font-black items-center"}>
                <div className={"mappool-header-text w-full italic text-center"}>
                    DANH SÁCH NGƯỜI CHƠI
                </div>
            </div>
            <div className={"h-1 w-1/2 border-2 border-white rounded-2xl mt-10"}>
            </div>
            <PlayersGrid playerData={playerData}/>

        </div>
    )
}

export default PlayersComponent