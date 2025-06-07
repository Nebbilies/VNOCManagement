import {RescheduleRequest} from "../Matches/MatchesComponent.tsx";
import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {useToast} from "../../context/ToastContext.tsx";

interface Props {
    rescheduleNotification: RescheduleRequest;
    setRefresh: (refresh: boolean) => void;
}



function RescheduleNotificationCard({rescheduleNotification, setRefresh}: Props) {
    const apiBase = import.meta.env.VITE_API_BASE_URL
    const {showSuccess, showError} = useToast();
    const [loading, setLoading] = useState(false);
    const [notificationInfoMenuOpen, setNotificationInfoMenuOpen] = useState(false);
    const handleRespond = async (Id: number, Status: 'ACCEPTED' | 'REJECTED') => {
        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/resch/respond`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Id,
                    Status,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                showError(`Error: ${errorData.error}`);
                throw new Error(`Error: ${errorData.message}`);
            }
            showSuccess(`Reschedule request ${Status === 'ACCEPTED' ? 'accepted' : 'rejected'} successfully!`);
            setNotificationInfoMenuOpen(false);
            setRefresh(true);
        } catch (error) {
            console.error("Error responding to reschedule request:", error);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <div
                className={'w-full h-16 p-3 border-b border-gray-700 hover:bg-[#2c2f45] flex items-center cursor-pointer'}
                onClick={() => setNotificationInfoMenuOpen(!notificationInfoMenuOpen)}
            >
                <img
                    className={'w-8 h-8 border-2 border-gray-600 rounded-full'}
                    src={'https://a.ppy.sh/' + rescheduleNotification.PlayerRequest.Id}
                    alt={rescheduleNotification.PlayerRequest.Username}/>
                <span className="text-xs font-bold text-gray-300 opacity-50 truncate text-wrap ml-3">
                Reschedule notification
            </span>
            </div>
            <AnimatePresence>
                {notificationInfoMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 0.6}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-gray-700 blur-l z-40 w-screen h-screen"
                            onClick={() => setNotificationInfoMenuOpen(false)}
                        />

                        {/* Modal */}
                        <motion.div
                            initial={{opacity: 0, scale: 0.9, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-10/11 sm:w-112"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-white">Reschedule Request</h2>

                            <div className={'font-normal'}>
                                <div className="mb-4">
                                    <div className="block text-sm font-medium text-white mb-1">
                                        Match ID
                                    </div>
                                    <div className={'flex w-full p-2 border-[#43496b] border-4 rounded mt-2'}>
                                        {rescheduleNotification.MatchId}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="block text-sm font-medium text-white mb-1">
                                        Reason
                                    </div>
                                    <div className={'flex w-full p-2 border-[#43496b] border-4 rounded mt-2'}>
                                        {rescheduleNotification.Reason}
                                    </div>
                                </div>

                                <div className={'flex gap-4 mt-4'}>
                                    <div className="w-1/2">
                                        <div
                                               className="block text-sm font-medium text-white mb-1">
                                            Match Date
                                        </div>
                                        <div className={'flex w-full p-2 border-[#43496b] border-4 rounded mt-2'}>
                                            {new Date(rescheduleNotification.NewTime).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="w-1/2">
                                        <div
                                               className="block text-sm font-medium text-white mb-1">
                                            Match Time
                                        </div>
                                        <div className={'flex w-full p-2 border-[#43496b] border-4 rounded mt-2'}>
                                            {new Date(rescheduleNotification.NewTime).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-2 w-full h-12 font-bold mt-6">
                                    <div
                                        className={`text-white flex justify-center items-center text-2xl bg-red-500 w-1/2 h-full rounded hover:bg-red-600 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'} `}
                                        onClick={() => handleRespond(rescheduleNotification.Id, 'REJECTED')}
                                    >
                                        Reject
                                    </div>
                                    <div
                                        className={`bg-green-500 text-white flex justify-center items-center text-2xl rounded w-1/2 hover:bg-green-600 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
                                        onClick={() => handleRespond(rescheduleNotification.Id, 'ACCEPTED')}
                                    >
                                        Accept
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default RescheduleNotificationCard;