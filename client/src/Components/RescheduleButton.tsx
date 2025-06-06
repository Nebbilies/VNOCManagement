import {useContext, useEffect, useState} from "react";
import checkValidDateTime from "../lib/checkValidDateTime.ts";
import {AnimatePresence, motion} from "motion/react";
import {CalendarClock} from 'lucide-react';
import {useToast} from "../context/ToastContext.tsx";
import {MatchesContext} from "../context/MatchesContext.tsx";

interface Props {
    matchId: string;
}

function RescheduleButton({matchId}: Props) {
    const { rescheduleRequests } = useContext(MatchesContext);
    const { showSuccess, showError } = useToast();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [reason, setReason] = useState<string>();
    const [reasonLength, setReasonLength] = useState<number>(0);
    const [newMatchDate, setNewMatchDate] = useState(new Date().toISOString().slice(0, 10));
    const [newMatchTime, setNewMatchTime] = useState(new Date().toISOString().slice(11, 16));
    const [dateTimeError, setDateTimeError] = useState<boolean>(false);
    const [hoveringReschedule, setHoveringReschedule] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const openModal = () => {
        if (rescheduleRequests.find((req) => req.MatchId === matchId && !['ACCEPTED', 'REJECTED'].includes(req.Status))) {
            showError("You already have a pending reschedule request for this match.");
            return;
        }
        setIsModalOpen(true);
    }
    const closeModal = () =>
    {
        setIsModalOpen(false);
        setLoading(false);
    }
    useEffect(() => {
        if (!checkValidDateTime(newMatchDate, newMatchTime)) {
            setDateTimeError(true);
        } else  {
            setDateTimeError(false);
        }
    }, [newMatchDate, newMatchTime])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const data = JSON.stringify({
            reason: reason,
            matchId: matchId,
            newDate: newMatchDate,
            newTime: newMatchTime,
        })
        const response = await fetch('http://localhost:3001/api/resch/add', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(`Error: ${errorData.error}`);
        } else {
            showSuccess(`Successfully initiated reschedule request for match ${matchId}`);
            setIsModalOpen(false);
        }
        setLoading(false);
    };

    return (
        <>

            <div onMouseEnter={() => setHoveringReschedule(true)}
                 onMouseLeave={() => setHoveringReschedule(false)}
                 className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <CalendarClock
                    onClick={openModal}
                    className="text-white cursor-pointer hover:text-blue-500 transition-colors duration-300"
                >
                </CalendarClock>
                <AnimatePresence>
                    {hoveringReschedule && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Reschedule
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
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 sm:w-112 w-10/11"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-white">Reschedule Request</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="matchId" className="block text-sm font-medium text-white mb-1">
                                        Reason
                                    </label>
                                    <div className={'flex'}>
                                        <textarea
                                            id="reason"
                                            maxLength={100}
                                            value={reason}
                                            onChange={(e) =>
                                            {
                                                setReason(e.target.value)
                                                setReasonLength(e.target.value.length)
                                            }}
                                            className="w-full p-2 h-36 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white text-wrap"
                                            required
                                        />
                                    </div>
                                    <div className="text-gray-400 text-sm font-normal mt-1">
                                        {reasonLength}/100 characters
                                    </div>
                                </div>

                                {/* New Time */}
                                <div className={'flex gap-4 mt-4'}>
                                    <div className="w-1/2">
                                        <label htmlFor="newMatchDate"
                                               className="block text-sm font-medium text-white mb-1">
                                            Match Date
                                        </label>
                                        <input
                                            type="date"
                                            id="newMatchDate"
                                            value={newMatchDate}
                                            onChange={(e) => setNewMatchDate(e.target.value)}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>

                                    <div className="w-1/2">
                                        <label htmlFor="newMatchTime"
                                               className="block text-sm font-medium text-white mb-1">
                                            Match Time
                                        </label>
                                        <input
                                            type="time"
                                            id="newMatchTime"
                                            value={newMatchTime}
                                            onChange={(e) => setNewMatchTime(e.target.value)}
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
                                        className={`text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'} `}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors ${dateTimeError || loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
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

export default RescheduleButton;