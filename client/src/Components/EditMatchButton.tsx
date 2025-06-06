import React, {useEffect, useState, useContext} from "react";
import checkValidDateTime from "../lib/checkValidDateTime.ts";
import {AnimatePresence, motion} from "motion/react";
import {Pencil} from 'lucide-react';
import {Match} from "./MatchesComponent.tsx"
import {playerSelectStyles} from "../lib/playerSelectStyles.tsx";
import Select from "react-select";
import {MatchesContext} from "../context/MatchesContext.tsx";
import {useToast} from "../context/ToastContext.tsx";

interface Props {
    currentMatch: Match;
}

export function EditMatchButton({currentMatch}: Props) {
    const {showSuccess, showError} = useToast();
    const { playerOptions, setRefresh } = useContext(MatchesContext);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [hoveringEditMatch, setHoveringEditMatch] = useState<boolean>(false);
    const [matchStatus, setMatchStatus] = useState<string>(currentMatch.status || 'SCHEDULED');
    const [player1Id, setPlayer1Id] = useState<number>(currentMatch.player1.Id);
    const [player2Id, setPlayer2Id] = useState<number>(currentMatch.player2.Id);
    const [matchDate, setMatchDate] = useState(currentMatch.time.split("T")[0]);
    const [matchTime, setMatchTime] = useState(currentMatch.time.split("T")[1].split(":").slice(0, 2).join(":"));
    const [player1Score, setPlayer1Score] = useState<number | null>(currentMatch.player1Score);
    const [player2Score, setPlayer2Score] = useState<number | null>(currentMatch.player2Score);
    const [dateTimeError, setDateTimeError] = useState<boolean>(false);
    const [samePlayerError, setSamePlayerError] = useState<boolean>(false);
    const [matchLink, setMatchLink] = useState<string | null>(currentMatch.matchLink);
    const [loading, setLoading] = useState<boolean>(false);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
    }
    useEffect(() => {
        if (!checkValidDateTime(matchDate, matchTime)) {
            setDateTimeError(true);
        } else  {
            setDateTimeError(false);
        }
    }, [matchDate, matchTime])
    useEffect(() => {
        if (player1Id === player2Id) {
            setSamePlayerError(true);
        } else {
            setSamePlayerError(false);
        }
    }, [player1Id, player2Id]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (dateTimeError || samePlayerError || loading) return;
        setLoading(true);
        const matchData = {
            newId: currentMatch.id,
            player1Id: player1Id,
            player2Id: player2Id,
            date: matchDate,
            time: matchTime,
            round: currentMatch.round,
            player1Score: player1Score,
            player2Score: player2Score,
            status: matchStatus,
            matchLink: matchLink || ""
        };
        const response = await fetch("http://localhost:3001/api/matches/edit/" + currentMatch.id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(matchData)
        })
        if (response.ok) {
            showSuccess("Match updated successfully!");
            setRefresh(true);
            closeModal();
        } else {
            const errorData = await response.json();
            showError(`Error updating match: ${errorData.message}`);
        }
        setLoading(false);
    };
    return (
        <>

            <div onMouseEnter={() => setHoveringEditMatch(true)}
                 onMouseLeave={() => setHoveringEditMatch(false)}
                 className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <Pencil
                    onClick={openModal}
                    className="text-white cursor-pointer hover:text-blue-500 transition-colors duration-300"
                >
                </Pencil>
                <AnimatePresence>
                    {hoveringEditMatch && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Edit Match
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 0.6}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-gray-700 blur-l z-40"
                            onClick={closeModal}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{opacity: 0, scale: 0.9, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-112"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-white">Edit Match</h2>

                            <form onSubmit={handleSubmit}>
                                {/* Players' ID */}
                                <div className="flex gap-4 mt-4">
                                    <div className="w-1/2">
                                        <label htmlFor="player1Id"
                                               className="block text-sm font-medium text-white mb-1">
                                            Player 1 ID
                                        </label>
                                        <Select
                                            name="player1Id"
                                            value={playerOptions.find(option => option.value === player1Id)}
                                            onChange={(selectedOption) => {
                                                setPlayer1Id(selectedOption?.value || playerOptions[0].value)
                                            }}
                                            options={playerOptions}
                                            styles={playerSelectStyles}
                                            className="w-full text-white"
                                            placeholder="Select Player 1"
                                            isSearchable={true}
                                            classNamePrefix="react-select"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="player2Id"
                                               className="block text-sm font-medium text-white mb-1">
                                            Player 2 ID
                                        </label>
                                        <Select
                                            name="player2Id"
                                            value={playerOptions.find(option => option.value === player2Id)}
                                            onChange={(selectedOption) => {
                                                setPlayer2Id(selectedOption?.value || playerOptions[0].value)
                                            }}
                                            options={playerOptions}
                                            styles={playerSelectStyles}
                                            className="w-full text-white"
                                            placeholder="Select Player 2"
                                            isSearchable={true}
                                            classNamePrefix="react-select"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    {samePlayerError && (
                                        <div className="text-red-500 text-sm">
                                            Player 1 and Player 2 cannot be the same.
                                        </div>
                                    )}
                                </div>
                                <div className={'flex gap-4 mt-4'}>
                                    <div className="w-1/2">
                                        <label htmlFor="matchDate"
                                               className="block text-sm font-medium text-white mb-1">
                                            Match Date
                                        </label>
                                        <input
                                            type="date"
                                            id="matchDate"
                                            value={matchDate}
                                            onChange={(e) => setMatchDate(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="matchTime"
                                               className="block text-sm font-medium text-white mb-1">
                                            Match Time
                                        </label>
                                        <input
                                            type="time"
                                            id="matchTime"
                                            value={matchTime}
                                            onChange={(e) => setMatchTime(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={'mt-2'}>
                                    {dateTimeError && (
                                        <div className="text-red-500 text-sm">
                                            Invalid date or time. Date time must be at least 6 hours from now.
                                        </div>
                                    )}
                                </div>
                                <div className={'flex gap-4 mt-2 justify-center'}>
                                    <div className={'w-1/2'}>
                                        <label htmlFor="player1Score"
                                               className={'block text-sm font-medium text-white mb-1'}>
                                            Player 1 Score
                                        </label>
                                        <input
                                            type="number"
                                            id="player1Score"
                                            value={player1Score || ''}
                                            onChange={(e) => setPlayer1Score(parseInt(e.target.value))}
                                            className={'w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white'}
                                        />
                                    </div>
                                    <div className={'w-1/2'}>
                                        <label htmlFor="player2Score"
                                               className={'block text-sm font-medium text-white mb-1'}>
                                            Player 2 Score
                                        </label>
                                        <input
                                            type="number"
                                            id="player2Score"
                                            value={player2Score || ''}
                                            onChange={(e) => setPlayer2Score(parseInt(e.target.value))}
                                            className={'w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white'}
                                        />
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label htmlFor="status" className="block text-sm font-medium text-white mb-1">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        value={matchStatus}
                                        onChange={(e) => setMatchStatus(e.target.value)}
                                        className="w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"
                                        required>
                                        <option value="SCHEDULED">Scheduled</option>
                                        <option value="ONGOING">Ongoing</option>
                                        <option value="FINISHED">Finished</option>
                                    </select>
                                </div>
                                <div className={'mt-2 mb-6'}>
                                    <label htmlFor="matchLink" className="block text-sm font-medium text-white mb-1">
                                        Match Link
                                    </label>
                                    <input
                                        type="text"
                                        id="matchLink"
                                        value={matchLink || ''}
                                        onChange={(e) => setMatchLink(e.target.value)}
                                        className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                    />
                                </div>
                                <div className="flex justify-center gap-2 w-full h-12 font-bold">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${dateTimeError || samePlayerError || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}