import {useEffect, useState} from "react";
import checkValidDateTime from "../lib/checkValidDateTime.ts";
import {AnimatePresence, motion} from "motion/react";
import {Pencil} from 'lucide-react';
import {Match} from "./MatchesComponent.tsx"

interface Props {
    currentMatch: Match;
}

export function EditMatchButton({currentMatch}: Props) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [matchId, setMatchId] = useState<string>(currentMatch.id);
    //Player 1 ID is the key of the players object
    const [player1Id, setPlayer1Id] = useState<number>(currentMatch.players[0].id);
    const [player2Id, setPlayer2Id] = useState<number>(currentMatch.players[1].id);
    const [matchDate, setMatchDate] = useState(currentMatch.date);
    const [matchTime, setMatchTime] = useState(currentMatch.time);
    const [player1Score, setPlayer1Score] = useState<number | null>(currentMatch.player1Score);
    const [player2Score, setPlayer2Score] = useState<number | null>(currentMatch.player2Score);
    const [dateTimeError, setDateTimeError] = useState<boolean>(false);
    const [matchLink, setMatchLink] = useState<string | null>(currentMatch.matchLink);
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (!checkValidDateTime(matchDate, matchTime)) {
            setDateTimeError(true);
        } else  {
            setDateTimeError(false);
        }
    }, [matchDate, matchTime])

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <>
            <Pencil
                onClick={openModal}
                className="text-white cursor-pointer hover:text-blue-500 transition-colors duration-300"
            >
            </Pencil>

            <AnimatePresence>
                {isModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-700 blur-l z-40"
                            onClick={closeModal}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-112"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-white">Add Match</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="matchId" className="block text-sm font-medium text-white mb-1">
                                        Match ID
                                    </label>
                                    <div className={'flex'}>
                                        <input
                                            type="string"
                                            id="matchId"
                                            value={matchId}
                                            onChange={(e) => setMatchId(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Players' ID */}
                                <div className="flex gap-4 mt-4">
                                    <div className="w-1/2">
                                        <label htmlFor="player1Id"
                                               className="block text-sm font-medium text-white mb-1">
                                            Player 1 ID
                                        </label>
                                        <input
                                            type="number"
                                            id="player1Id"
                                            value={player1Id}
                                            onChange={(e) => setPlayer1Id(parseInt(e.target.value))}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="player2Id" className="block text-sm font-medium text-white mb-1">
                                            Player 2 ID
                                        </label>
                                        <input
                                            type="text"
                                            id="player2Id"
                                            value={player2Id}
                                            onChange={(e) => setPlayer2Id(parseInt(e.target.value))}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className={'flex gap-4 mt-4'}>
                                    <div className="w-1/2">
                                        <label htmlFor="matchDate" className="block text-sm font-medium text-white mb-1">
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
                                        <label htmlFor="matchTime" className="block text-sm font-medium text-white mb-1">
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
                                        required
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
                                        className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${dateTimeError ? 'cursor-not-allowed opacity-50' : ''}`}
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