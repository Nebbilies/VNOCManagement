import {AnimatePresence, motion} from "motion/react"
import {useEffect, useState} from "react";
import checkValidDateTime from "../lib/checkValidDateTime.ts";
import { Plus } from 'lucide-react';

export default function AddMatchButton() {
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const [matchId, setMatchId] = useState<string>();
        const [player1Id, setPlayer1Id] = useState<number>();
        const [player2Id, setPlayer2Id] = useState<number>();
        const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 10));
        const [matchTime, setMatchTime] = useState(new Date().toISOString().slice(11, 16));
        const [dateTimeError, setDateTimeError] = useState<boolean>(false);
        const openModal = () => setIsModalOpen(true);
        const closeModal = () => setIsModalOpen(false);

        const [hoveringAddMatch, setHoveringAddMatch] = useState<boolean>(false);

        useEffect(() => {
            if (!checkValidDateTime(matchDate, matchTime)) {
                setDateTimeError(true);
            } else  {
                setDateTimeError(false);
            }
        }, [matchDate, matchTime])

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

        };

        return (
            <>
                <div onMouseEnter={() => setHoveringAddMatch(true)}
                     onMouseLeave={() => setHoveringAddMatch(false)}
                     className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                    <Plus className={'h-full w-auto'}
                        onClick={openModal}
                    >
                    </Plus>
                    <AnimatePresence>
                        {hoveringAddMatch && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                            >
                                Add Match
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>


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
                                    <div className={'mt-2 mb-6'}>
                                        {dateTimeError && (
                                            <div className="text-red-500 text-sm">
                                                Invalid date or time. Date time must be at least 6 hours from now.
                                            </div>
                                        )}
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
    };
