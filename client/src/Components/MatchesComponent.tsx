import {PlayerData} from "./PlayersComponent.tsx";
import MatchesContent from "./MatchesContent.tsx";
import AddMatchButton from "./AddMatchButton.tsx";
import {ManageMatchButton} from "./ManageMatchButton.tsx";

export interface Match {
    id: string;
    date: string;
    time: string
    players: PlayerData;
    player1Score: number | null;
    player2Score: number | null;
    matchLink: string | null;
    status: string;
    round: string;
}

export type MatchData = Match[]

const dummyMatchData: MatchData =
[
        {
            id: "1",
            date: '2025-12-12',
            time: '12:00',
            players: [
                {
                    "Id": 10635981,
                    "Username": "- Nebby -",
                    "Rank": 2903,
                },
                {
                    "Id": 7696512,
                    "Username": "Hoaq",
                    "Rank": 2903,
                },
            ],
            player1Score: null,
            player2Score: null,
            matchLink: null,
            status: "SCHEDULED",
            round: "Round of 16",
        },
        {
            id: "2",
            date: '2025-12-12',
            time: '12:00',
            players: [
                {
                    "Id": 12561202,
                    "Username": "TKieenaaaaaaaaaaaaaaaaa",
                    "Rank": 29038,
                },
                {
                    "Id": 14047619,
                    "Username": "Zeigler",
                    "Rank": 831,
                },
            ],
            player1Score: 3,
            player2Score: 5,
            matchLink: null,
            status: "FINISHED",
            round: "Round of 16",
        },
        {
            id: "3",
            date: '2025-12-12',
            time: '12:00',
            players: [
                {
                    "Id": 10635981,
                    "Username": "- Nebby -",
                    "Rank": 2903,
                },
                {
                    "Id": 7696512,
                    "Username": "Hoaq",
                    "Rank": 2903,
                },
            ],
            player1Score: null,
            player2Score: null,
            matchLink: null,
            status: "SCHEDULED",
            round: "Round of 16",
        },
        {
            id: "4",
            date: '2025-12-12',
            time: '12:00',
            players: [
                {
                    "Id": 12561202,
                    "Username": "TKieen",
                    "Rank": 29038,
                },
                {
                    "Id": 14047619,
                    "Username": "Zeigler",
                    "Rank": 831,
                },
            ],
            player1Score: 3,
            player2Score: 5,
            matchLink: null,
            status: "FINISHED",
            round: "Round of 16",
        }
    ]


function MatchesComponent(){
    return (
        <div className={"matches-container flex flex-col max-w-screen h-auto lg:px-8 " +
            "mt-40 mb-20 pt-5 pb-10 md:mx-10 lg:mx-20 xl:mx-64 mx-2 self-center text-white bg-gray-900/20"}>
            <div className={"matches-header flex items-center justify-between mb-5 h-20"}>
                <h1 className={"lg:text-6xl font-black text-5xl"}>Matches</h1>
                <div className={'controller-buttons flex items-center gap-4 h-full'}>
                    <AddMatchButton/>
                    <ManageMatchButton/>
                </div>
            </div>
            <MatchesContent matchesData={dummyMatchData} />
        </div>

    )
}

export default MatchesComponent;