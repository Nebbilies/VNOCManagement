import {Ban} from 'lucide-react';
import {useContext, useState} from 'react';
import {AnimatePresence, motion} from "motion/react";
import {useToast} from "../../context/ToastContext.tsx";
import {MatchesContext} from "../../context/MatchesContext.tsx";

interface Props  {
    matchId: string
}

export function DeleteMatchButton({ matchId }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hoveringDeleteMatch, setHoveringDeleteMatch] = useState(false);
    const {showSuccess, showError} = useToast();
    const { setRefresh } = useContext(MatchesContext)
    const apiBase = import.meta.env.VITE_API_BASE_URL
    const handleDelete = async () => {
            setLoading(true);
            const response = await fetch(`${apiBase}/matches/${matchId}`, {
                method: 'DELETE',
                credentials: "include"
            });
            if (!response.ok) {
                showError('Failed to delete match');
            }
            else {
                showSuccess('Match deleted successfully');
                setRefresh(true);
            }
            setLoading(false);
    };

    return (
        <>

            <div onMouseEnter={() => setHoveringDeleteMatch(true)}
                 onMouseLeave={() => setHoveringDeleteMatch(false)}
                 className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <Ban onClick={() => setShowModal(true)}
                     className="text-red-300 cursor-pointer hover:text-red-400 transition-colors duration-300">
                </Ban>
                <AnimatePresence>
                    {hoveringDeleteMatch && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Delete Match
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 0.6}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-gray-600 blur-xl z-40"
                            onClick={() => {
                                setShowModal(false)
                            }}/>

                        <motion.div
                            initial={{opacity: 0, scale: 0.9, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 z-50 w-96"
                        >
                            <div className="bg-[#23263a] rounded-lg p-6 text-white">
                                <div>Are you sure you want to delete match <b>{matchId}</b>?</div>
                                <div className="mt-4 flex gap-3">
                                    <button onClick={() => setShowModal(false)}
                                            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer">Cancel
                                    </button>
                                    <button onClick={() => {
                                        handleDelete()
                                    }}
                                            className={`px-4 py-2 bg-red-600 rounded hover:bg-red-700 ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence></>
    );
}