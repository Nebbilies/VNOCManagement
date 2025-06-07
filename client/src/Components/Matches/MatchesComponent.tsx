import {Player, PlayerData} from "../Players/PlayersComponent.tsx";
import {RoundInfo} from "../Mappool/MappoolComponent.tsx";
import MatchesContent from "./MatchesContent.tsx";
import  {MatchesContext} from "../../context/MatchesContext.tsx";
import AddMatchButton from "./AddMatchButton.tsx";
import {ManageMatchButton} from "./Manage/ManageMatchButton.tsx";
import {Staff} from "../Staff/StaffComponent.tsx";
import {useState, useEffect} from "react";
import {Loading} from "../Utility/Loading.tsx";
import {fetchMatches, fetchPlayers, fetchRescheduleRequests, fetchRounds} from "../../lib/fetchFunctions.tsx"
import {useToast} from "../../context/ToastContext.tsx";
import {useUser} from "../../context/UserContext.tsx";

export interface Match {
    id: string;
    time: string;
    player1: Player;
    player2: Player;
    player1Score: number | 0;
    player2Score: number | 0;
    matchLink: string | null;
    staff: Staff[];
    status: string;
    round: string;
}

export interface ReactSelectOptions {
    readonly value: number;
    readonly label: string;
}

export type MatchData = Match[]

export interface RescheduleRequest {
    Id: number;
    MatchId: string;
    NewTime: string;
    Reason: string;
    Status: string;
    PlayerRequest: Player;
    PlayerRespond: Player;
}

const sortMatchesByTime = (matches: MatchData): MatchData => {
    return matches.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

function MatchesComponent() {
    const {user} = useUser();
    let userRole = "";
    if (user) {
        userRole = user.role;
    }
    const {showError} = useToast();
    const [matchData, setMatchData] = useState<MatchData>([])
    const [fetchingData, setFetchingData] = useState<boolean>(true)
    const [refresh, setRefresh] = useState<boolean>(false);
    const [playerOptions, setPlayerOptions] = useState<ReactSelectOptions[]>([]);
    const [roundsList, setRoundsList] = useState<RoundInfo[]>([]);
    const [currentRound, setCurrentRound] = useState<string>("");
    const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<MatchData>([]);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        setFetchingData(true);
        fetchMatches(signal)
            .then((data: MatchData) => {
                setMatchData(sortMatchesByTime(data));
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching matches:", error);
                }
            })
            .finally(() => {
                setFetchingData(false);
                setRefresh(false);
            })
        fetchPlayers(signal)
            .then((data: PlayerData) => {
                const options: ReactSelectOptions[] = data.map((player: Player) => ({
                    value: player.Id,
                    label: player.Username
                }));
                setPlayerOptions(options);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching matches:", error);
                    showError("Error fetching players. Please refresh or try again later.");
                }
            })
        fetchRounds(signal)
            .then((data: RoundInfo[]) => {
                setRoundsList(data);
                if (data.length > 0) {
                    setCurrentRound(data[0].Acronym);
                }
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching matches:", error);
                }
            })
        fetchRescheduleRequests({signal})
            .then((data: RescheduleRequest[]) => {
                setRescheduleRequests(data);
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching reschedule requests:", error);
                }
            });
        return () => {
            abortController.abort();
            setMatchData([]);
            setFetchingData(false);
            setRefresh(false);
        };
    }, [refresh]);

    useEffect(() => {
        // Filter matches based on the current round
        if (currentRound) {
            const filtered = matchData.filter((match) => match.round === currentRound);
            setFilteredMatches(filtered);
        } else {
            setFilteredMatches(matchData);
        }
    }, [currentRound, matchData]);
    // Default round option
    const matchIds: string[] = matchData.map((match) => match.id);
    return (
        <div className={"matches-container flex flex-col max-w-screen h-auto lg:px-8 " +
            "mt-20 lg:mt-40 mb-20 pt-5 pb-10 md:mx-10 lg:mx-20 xl:mx-64 mx-2 self-center text-white bg-gray-900/20"}>
            <div className={"matches-header flex items-center justify-between h-20"}>
                <h1 className={"lg:text-5xl font-black text-4xl"}>MATCHES</h1>
                <div className={'controller-buttons flex items-center gap-4 h-full'}>
                        {userRole === "REFEREE" || userRole === "ADMIN" ? (
                            <AddMatchButton setRefresh={setRefresh} playerOptions={playerOptions} roundsList={roundsList} matchIds={matchIds}/>
                        ) : null}
                    {userRole === "ADMIN" && (
                        <ManageMatchButton/>
                    )}
                </div>
            </div>
            { fetchingData ? (
                <Loading/>
            ) : (
                <>
                    <div
                        className={"font-bold text-2xl justify-center items-center flex mt-2 gap-4"}>
                        <div>
                            <span className={"text-white"}>Round: </span>
                        </div>
                        <select name={"round-selection"} id={"round-selection"}
                                className={"text-white text-center focus:ring-blue-500 bg-[#23263a] focus:border-blue-500 rounded-xl p-1"}
                                value={currentRound}
                                onChange={(e) => setCurrentRound(e.target.value)}
                        >
                            {
                                roundsList.map((round) => {
                                    return (
                                        <option key={round.Acronym} value={round.Acronym}>
                                            {round.Round}
                                        </option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className={"matches-content flex flex-col w-full h-auto bg-gray-900/20 rounded-lg mt-4"}>
                        <div className={"matches-list flex flex-col w-full h-auto rounded-lg p-0 md:p-5"}>
                            {filteredMatches.length > 0 ? (
                                <MatchesContext.Provider value={{playerOptions, roundsList, setRefresh, rescheduleRequests}}>
                                    {filteredMatches.map((match, index) => (
                                        <MatchesContent index={index} match={match}/>
                                    ))}
                                </MatchesContext.Provider>
                            ) : (
                                <div className={"flex items-center justify-center h-64"}>
                                    <h2 className={"text-2xl font-bold text-gray-400"}>No matches found</h2>
                                </div>
                            )}
                        </div>
                    </div>
                </>

            )
            }

        </div>

    )
}

export default MatchesComponent;