import {useEffect, useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {RoundInfo} from "./MappoolComponent.tsx";
import {fetchRounds} from "../lib/fetchFunctions.tsx";
import {AddRoundModal} from "./AddRoundModal.tsx";
import {Pencil, Ban} from "lucide-react";
import {useToast} from "../context/ToastContext.tsx";

interface EditRoundModalProps {
    setRefresh: (refresh: boolean) => void;
    round: RoundInfo;
}

const EditRoundModal = ({setRefresh, round}: EditRoundModalProps) => {
    const [roundName, setRoundName] = useState(round.Round);
    const [roundAcronym, setRoundAcronym] = useState(round.Acronym);
    const {showSuccess, showError} = useToast();
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        const response = await fetch('http://localhost:3001/api/round/edit', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                oldAcronym: round.Acronym,
                newRound: roundName,
                newAcronym: roundAcronym,
            }),
        })
        if (!response.ok) {
            const errorData = await response.json();
            showError(`Error: ${errorData.error}. Please check the round acronym.`);
        } else {
            showSuccess(`Round ${roundName} edited successfully!`);
            setRefresh(true);
            setIsModalOpen(false);
        }
        setLoading(false);
    };
    return (
        <>
            <div
                className="text-green-500 hover:text-green-700 transition-colors p-1 rounded-full cursor-pointer  bg-[#1b1d2e]"
                aria-label="Approve Request"
                onClick={() => setIsModalOpen(true)}
            >
                <Pencil className="w-5 h-5"/>
            </div>

            {isModalOpen && (
                <AnimatePresence>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 0.6}}
                        exit={{opacity: 0}}
                        className="fixed inset-0 bg-gray-700 blur-l z-40"
                        onClick={() => {
                            setIsModalOpen(false)
                        }}
                    />
                    {/* Modal */}
                    <motion.div
                        initial={{opacity: 0, scale: 0.9, y: 20}}
                        animate={{opacity: 1, scale: 1, y: 0}}
                        exit={{opacity: 0, scale: 0.9, y: 20}}
                        transition={{type: "spring", damping: 25, stiffness: 300}}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-96"
                    >
                        <h2 className="text-xl font-semibold mb-4 text-white">Add Round</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="roundName" className="block text-sm font-medium text-white mb-1">
                                    Round Name
                                </label>
                                <div className={'flex'}>
                                    <input
                                        type="text"
                                        id="beatmapId"
                                        maxLength={16}
                                        value={roundName}
                                        onChange={(e) => setRoundName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 mt-4 mb-6">
                                <div className="w-full">
                                    <label htmlFor="roundAcronym" className="block text-sm font-medium text-white mb-1">
                                        Round Acronym
                                    </label>
                                    <input
                                        type="text"
                                        id="roundAcronym"
                                        maxLength={4}
                                        value={roundAcronym}
                                        onChange={(e) => setRoundAcronym(e.target.value)}
                                        className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center gap-2 w-full h-12">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false)
                                    }}
                                    className={`text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                >
                                    Confirm
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </AnimatePresence>
            )}
        </>
    )
}

export function TourneyRoundsModal() {
    const [isAddRoundModalOpen, setIsAddRoundModalOpen] = useState<boolean>(false);
    const [hoveringRound, setHoveringRound] = useState<string>("");
    const closeAddRoundModal = () => {
        setIsAddRoundModalOpen(false);
    }
    const [roundsList, setRoundsList] = useState<RoundInfo[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        fetchRounds(signal)
            .then((data) => {
                setRoundsList(data);
            })
            .finally(() => {
                setRefresh(false);
            })
        return () => {
            abortController.abort();
        }
    }, [refresh])
    return (
        <>
            <div className="flex-col w-full lg:w-1/2 bg-[#23263a] p-6 rounded-lg shadow-2xl">
                <h2 className="text-xl font-semibold mb-4 text-white text-center">Tourney Rounds</h2>
                <div
                    className={'rounds-list flex flex-col rounded-md bg-[#1b1d2e] w-full h-60 overflow-y-scroll items-center'}>
                    {roundsList.map((round, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between w-full p-4 border-b border-gray-700 hover:bg-[#2c2f45] transition-colors relative"
                            onMouseEnter={() => setHoveringRound(round.Acronym)}
                            onMouseLeave={() => setHoveringRound("")}
                        >
                            <div className={'flex-grow'}>
                                <span className="text-white text-lg font-bold">{round.Round}</span>
                                <span className="text-gray-400 text-sm font-semibold ml-2">{round.Acronym}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {hoveringRound === round.Acronym && (
                                    <>
                                        <EditRoundModal setRefresh={setRefresh} round={round}/>
                                        <div
                                            className="text-red-500 hover:text-red-700 p-1 rounded-full cursor-pointer bg-[#1b1d2e] "
                                            aria-label="Reject Request">
                                            <Ban className="w-5 h-5"/>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <button
                    className={'w-full cursor-pointer bg-green-500 hover:bg-green-600 mt-4 rounded-md p-2 font-bold text-xl transition-color duration-300'}
                    onClick={() => {
                        setIsAddRoundModalOpen(true);
                    }}>
                    Add Round
                </button>
            </div>
            {isAddRoundModalOpen && (
                <AddRoundModal closeAddRoundModal={closeAddRoundModal} setRefresh={setRefresh}/>
            )}
        </>
    );
}