import { CircleFadingPlus } from 'lucide-react';
import {useContext, useState} from 'react';
import {AnimatePresence, motion} from "motion/react";
import {useToast} from "../context/ToastContext.tsx";
import {MatchesContext} from "../context/MatchesContext.tsx";

interface Props  {
    matchId: string
}

export function ClaimMatchButton({ matchId }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hoveringClaimMatch, setHoveringClaimMatch] = useState(false);
    const {showSuccess, showError} = useToast();
    const { setRefresh } = useContext(MatchesContext)
    let user = localStorage.getItem("user") || null;
    user = user ? JSON.parse(user) : null;

    const handleClaim = async () => {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/matches/claim`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                matchId: matchId,
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            if (errorData.error) {
                showError("Failed to claim match: " + errorData.error);
            } else {
                showError('Failed to claim match');
            }
        }
        else {
            showSuccess('Match claimed successfully');
            setRefresh(true);
        }
        setLoading(false);
    };

    return (
        <>

            <div onMouseEnter={() => setHoveringClaimMatch(true)}
                 onMouseLeave={() => setHoveringClaimMatch(false)}
                 className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <CircleFadingPlus onClick={() => setShowModal(true)}
                     className="text-white cursor-pointer hover:text-blue-500 transition-colors duration-300">
                </CircleFadingPlus>
                <AnimatePresence>
                    {hoveringClaimMatch && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Claim Match
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
                                <div>Are you sure you want to claim match <b>{matchId}</b> {user ? "as " + user.role : ""}?</div>
                                <div className="mt-4 flex gap-3">
                                    <button onClick={() => setShowModal(false)}
                                            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 cursor-pointer">Cancel
                                    </button>
                                    <button onClick={() => {
                                        handleClaim()
                                    }}
                                            className={`px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 duration-300 ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}>
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence></>
    );
}