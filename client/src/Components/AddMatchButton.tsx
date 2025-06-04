import {AnimatePresence, motion} from "motion/react"
import React, {useEffect, useState} from "react";
import checkValidDateTime from "../lib/checkValidDateTime.ts";
import { Plus } from 'lucide-react';
import {RoundInfo} from "./MappoolComponent.tsx";
import Select from "react-select";
import {ReactSelectOptions} from "./MatchesComponent.tsx";
import {playerSelectStyles} from "../lib/playerSelectStyles.tsx";
import {useToast} from "../context/ToastContext.tsx";

interface Props {
    setRefresh : (refresh: boolean) => void;
    playerOptions: ReactSelectOptions[];
    roundsList: RoundInfo[];
    matchIds: string[];
}

export default function AddMatchButton({setRefresh, playerOptions, roundsList, matchIds}: Props) {
        let matchIdCounter = 1;
        while (matchIds.includes(matchIdCounter.toString())) {
            matchIdCounter++;
        }
        const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
        const [matchId, setMatchId] = useState<string>(matchIdCounter.toString());
        const [player1Id, setPlayer1Id] = useState<number>(playerOptions.length  > 0 ? playerOptions[0].value : 0);
        const [player2Id, setPlayer2Id] = useState<number>(playerOptions.length  > 0 ? playerOptions[0].value : 0);
        const [matchDate, setMatchDate] = useState(new Date().toISOString().slice(0, 10));
        const [matchTime, setMatchTime] = useState(new Date().toISOString().slice(11, 16));
        const [roundName, setRoundName] = useState<string>(roundsList.length > 0 ? roundsList[0].Acronym : '');
        const [loading,  setLoading] = useState<boolean>(false);
        const [dateTimeError, setDateTimeError] = useState<boolean>(false);
        const [samePlayerError, setSamePlayerError] = useState<boolean>(false);
        const [duplicateMatchIdError, setDuplicateMatchIdError] = useState<boolean>(false);
        const { showSuccess, showError } = useToast();
        const openModal = () => setIsModalOpen(true);
        const closeModal = ()=> {
            setIsModalOpen(false);
            setMatchId(matchIdCounter.toString());
            setPlayer1Id(playerOptions.length  > 0 ? playerOptions[0].value : 0);
            setPlayer2Id(playerOptions.length  > 0 ? playerOptions[0].value : 0);
            setMatchDate(new Date().toISOString().slice(0, 10));
            setMatchTime(new Date().toISOString().slice(11, 16));
            setRoundName(roundsList.length > 0 ? roundsList[0].Acronym : '');
            setLoading(false);
        }

        const [hoveringAddMatch, setHoveringAddMatch] = useState<boolean>(false);
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
        useEffect(() => {
            if (matchIds.includes(matchId)) {
                setDuplicateMatchIdError(true);
            } else {
                setDuplicateMatchIdError(false);
            }
        }, [matchId, matchIds]);
        useEffect(() => {
            setRoundName(roundsList.length > 0 ? roundsList[0].Acronym : '');
        }, [roundsList]);

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (dateTimeError) {
                return;
            }
            setLoading(true);
            const matchData = {
                id: matchId,
                player1Id: player1Id,
                player2Id: player2Id,
                date: matchDate,
                time: matchTime,
                round: roundName
            };
            const response = await fetch("http://localhost:3001/api/matches/add",
                {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(matchData)
                }
                )
            if (response.ok) {
                showSuccess("Match added successfully!");
                setRefresh(true);
                closeModal();
            }
            else {
                const errorData = await response.json();
                showError(`${errorData.error}. Please review the match details.`);
            }
            setLoading(false);
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
                                    {duplicateMatchIdError && (
                                        <div className="text-red-500 text-sm mb-4">
                                            Match ID already exists. Please choose a different ID.
                                        </div>
                                    )}
                                    <div className={"mt-4"}>
                                        <label htmlFor="roundName"
                                               className="block text-sm font-medium text-white mb-1">
                                            Round Acronym
                                        </label>
                                        <select name={"roundName"} id={"roundName"}
                                                className={"w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"}
                                                value={roundName}
                                                onChange={(e) => setRoundName(e.target.value)}
                                        >
                                            {roundsList.map((round) => (
                                                <option key={round.Acronym} value={round.Acronym}>
                                                    {round.Round}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Players' ID */}
                                    <div className="flex gap-4 mt-4">
                                        <div className="w-1/2">
                                        <label htmlFor="player1Id"
                                                   className="block text-sm font-medium text-white mb-1">
                                                Player 1 ID
                                            </label>
                                            <Select
                                                name="player1Id"
                                                defaultValue={playerOptions[0]}
                                                value={playerOptions.find(option => option.value === player1Id)}
                                                onChange={(selectedOption) =>
                                                    {
                                                        setPlayer1Id(selectedOption?.value || playerOptions[0].value)
                                                    }}
                                                options={playerOptions}
                                                isSearchable={true}
                                                styles={playerSelectStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                required
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label htmlFor="player2Id" className="block text-sm font-medium text-white mb-1">
                                                Player 2 ID
                                            </label>
                                            <Select
                                                name="player2Id"
                                                defaultValue={playerOptions[0]}
                                                value={playerOptions.find(option => option.value === player2Id)}
                                                onChange={(selectedOption) =>
                                                    {
                                                        setPlayer2Id(selectedOption?.value || playerOptions[0].value)
                                                    }}
                                                options={playerOptions}
                                                isSearchable={true}
                                                styles={playerSelectStyles}
                                                className="react-select-container"
                                                classNamePrefix="react-select"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className={'mt-2'}>
                                        {samePlayerError && (
                                            <div className="text-red-500 text-sm">
                                                Player 1 and Player 2 cannot be the same.
                                            </div>
                                        )}
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
                                            className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${dateTimeError || samePlayerError || duplicateMatchIdError || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
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
