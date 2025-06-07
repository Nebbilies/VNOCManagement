import {Ban, Check} from 'lucide-react';
import {useEffect, useState} from "react";
import {RescheduleRequest} from "../MatchesComponent.tsx";
import {fetchRescheduleRequests} from "../../../lib/fetchFunctions.tsx";
import {useToast} from "../../../context/ToastContext.tsx";
import {AnimatePresence, motion} from "motion/react";

export function RescheduleRequestsModal() {
    const {showSuccess, showError} = useToast();
    const [hoveringRequest, setHoveringRequest] = useState<number>(-1);
    const [rescheduleRequests, setRescheduleRequests] = useState<RescheduleRequest[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const apiBase = import.meta.env.VITE_API_BASE_URL
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        fetchRescheduleRequests({signal, status: "INITIALIZED"})
            .then((data: RescheduleRequest[]) => {
                setRescheduleRequests(data);
            })
            .catch((error) => {
                console.error("Error fetching reschedule requests:", error);
            });
        return () => {
            abortController.abort();
        }
    }, []);
    const respondRequest = async (requestId: number, action: string): Promise<void> => {
        setLoading(true)
        const response = await fetch(`${apiBase}/resch/${action === 'APPROVE' ? 'approve' : 'reject'}`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Id: requestId
            })
        })
        if (!response.ok) {
            const errorData = await response.json();
            showError(`Error: ${errorData.message}`);
        } else {
            showSuccess(`Reschedule request ${action === 'APPROVE' ? 'approved' : 'rejected'} successfully!`);
            setRescheduleRequests(prev => prev.filter(req => req.Id !== requestId));
        }
        setLoading(false)
    }
    return (
        <>
            <div className={'flex-col w-full  lg:w-1/2 bg-[#23263a] p-6 rounded-lg shadow-2xl'}>
                <h2 className="text-xl font-semibold mb-4 text-white text-center">Reschedule Requests</h2>
                <div
                    className={`requests-list flex flex-col rounded-md bg-[#1b1d2e] w-full h-60 overflow-y-scroll items-center ${loading ? 'pointer-events-none opacity-50' : ''}`}>
                    {rescheduleRequests.map((resRequest) => (
                        <div
                            key={resRequest.Id}
                            className="flex items-center justify-between w-full p-4 border-b border-gray-700 hover:bg-[#2c2f45] transition-colors"
                            onMouseEnter={() => setHoveringRequest(resRequest.Id)}
                            onMouseLeave={() => setHoveringRequest(-1)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="text-md font-semibold text-white">
                                    Match ID: {resRequest.MatchId}
                                </div>
                                <div className="text-sm text-gray-400">
                                    <span className={'font-bold'}>{resRequest.PlayerRequest.Username}</span> requested a
                                    reschedule
                                </div>
                            </div>
                            <AnimatePresence>
                                {hoveringRequest === resRequest.Id ? (
                                    <>
                                        <motion.div
                                            initial={{opacity: 0, y: -10}}
                                            animate={{opacity: 1, y: 0}}
                                            exit={{opacity: 0, y: -10}}
                                            transition={{type: "spring", damping: 25, stiffness: 300}}
                                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[100%] bg-gray-800 shadow-lg z-50 flex flex-col text-left"
                                        >
                                            <span>
                                                <b>Requested time:</b> {new Date(resRequest.NewTime).toLocaleString()}
                                            </span>
                                            <span>
                                                <b>Reason:</b> {resRequest.Reason || 'No reason provided'}
                                            </span>
                                        </motion.div>
                                        <div className={'control-buttons flex items-center gap-2 w-1/5 ml-1'}>
                                            <button
                                                onClick={() => {
                                                    // Handle approve action
                                                    respondRequest(resRequest.Id, 'APPROVE')
                                                    // Refresh list when done

                                                }}
                                                className="text-green-500 hover:text-green-700 bg-[#1b1d2e] transition-colors p-1 rounded-full cursor-pointer h-full"
                                                aria-label="Approve Request">
                                                <Check className="w-5 h-5"/>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    // Handle reject action
                                                    respondRequest(resRequest.Id, 'REJECT')
                                                    // Refresh list when done
                                                }}
                                                className="text-red-500 hover:text-red-700 bg-[#1b1d2e] transition-colors p-1 rounded-full cursor-pointer"
                                                aria-label="Reject Request">
                                                <Ban className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </>
                                        ) : (
                                        <div className='w-1/5 ml-1'>
                                        </div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}