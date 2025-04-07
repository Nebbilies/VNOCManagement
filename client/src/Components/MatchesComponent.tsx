import Header from "./Header.tsx";
import {playerData} from "./PlayersComponent.tsx";
import MatchesContent from "./MatchesContent.tsx";

export interface Match {
    id: number;
    date: number; //unix
    players: playerData;
}

export interface MatchData {
    matches: Match[];
}

const dummyMatchData: MatchData = {
    matches: [
        {
            id: 1,
            date: 1243478444,
            players: {
                "10635981": {
                    "username": "- Nebby -",
                    "globalRanking": 2903,
                },
                "7696512": {
                    "username": "Hoaq",
                    "globalRanking": 2903,
                },
            }
        },
        {
            id: 2,
            date: 1243478444,
            players: {
                "12561202": {
                    "username": "TKieen",
                    "globalRanking": 29038,
                },
                "14047619": {
                    "username": "Zeigler",
                    "globalRanking": 831,
                },
            }
        },
        {
            id: 3,
            date: 1243478444,
            players: {
                "10635981": {
                    "username": "- Nebby -",
                    "globalRanking": 2903,
                },
                "7696512": {
                    "username": "Hoaq",
                    "globalRanking": 2903,
                },
            }
        },
        {
            id: 4,
            date: 1243478444,
            players: {
                "12561202": {
                    "username": "TKieen",
                    "globalRanking": 29038,
                },
                "14047619": {
                    "username": "Zeigler",
                    "globalRanking": 831,
                },
            }
        }
    ]
}

function MatchesComponent(){
    <Header/>
    return (
        <div className={"matches-container flex flex-col max-w-screen h-auto px-4 lg:px-8 " +
            "mt-40 mb-20 pt-5 pb-10 md:mx-10 lg:mx-20 xl:mx-64 mx-4 self-center text-white bg-gray-900/20"}>
            <div className={"matches-header flex items-center justify-between mb-5"}>
                <h1 className={"text-6xl font-black"}>Matches</h1>
                <button className={"bg-violet-500 text-2xl w-1/4 hover:bg-violet-700 text-white font-bold py-2 px-4 mx-4 cursor-pointer rounded rounded-2xl transition-colors duration-300"}>
                    Create a match
                </button>
            </div>
            <MatchesContent matchesData={dummyMatchData} />
        </div>

    )
}

export default MatchesComponent;