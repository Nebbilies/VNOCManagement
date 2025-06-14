import {Plus} from "lucide-react";
import {AnimatePresence, motion} from "motion/react";
import React, {useState} from "react";
import { useToast } from "../../context/ToastContext.tsx";

interface Props {
    toggleRefresh: (refresh: boolean) => void;
}

export function AddStaffButton({toggleRefresh}: Props) {
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    const [HoveringAddStaff, setHoveringAddStaff] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState<number>();
    const [position, setPosition] = useState<string>('REFEREE');
    const [loading, setLoading] = useState(false);
    const {showSuccess, showError} = useToast();
    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
        setPosition('REFEREE');
    };
    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        if (!userId || !position) {
            alert('Please fill in all fields');
            console.log(userId, position);
            setLoading(false);
            return;
        }
        try {
            const response = await fetch(`${apiBase}/staff/add`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: userId, role: position }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                showError(errorData.error || 'Failed to add staff');
                throw new Error('Network response was not ok');
            }
            showSuccess(`Staff with ID ${userId} added successfully!`);
            toggleRefresh(true);
        } catch (error) {
            console.log(error);
        }
        closeModal();
        setTimeout(
            () => {
                setLoading(false);
            },
            4000
        )
    };
    return (
        <>
            <div onMouseEnter={() => setHoveringAddStaff(true)}
                 onMouseLeave={() => setHoveringAddStaff(false)}
                 className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <Plus className={'h-full w-auto'}
                      onClick={openModal}
                >
                </Plus>
                <AnimatePresence>
                    {HoveringAddStaff && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Add Staff
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
                            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#23263a] rounded-lg shadow-2xl p-6 z-50 w-10/11 sm:w-96"
                        >
                            <h2 className="text-xl font-semibold mb-4 text-white">Add Staff</h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="userId" className="block text-sm font-medium text-white mb-1">
                                        User ID
                                    </label>
                                    <div className={'flex'}>
                                        <input
                                            type="number"
                                            id="userId"
                                            value={userId}
                                            onChange={(e) => setUserId(parseInt(e.target.value))}
                                            className="w-full p-2 border border-gray-300 font-normal text-xl rounded focus:ring-violet-500 focus:border-violet-500 text-white"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-4 mt-4 mb-6">
                                    <div className="w-full">
                                        <label htmlFor="position" className="block text-sm font-medium text-white mb-1">
                                            Position
                                        </label>
                                        <select
                                            id="position"
                                            value={position}
                                            onChange={(e) => setPosition(e.target.value)}
                                            className="w-full p-[8.7px] border border-gray-300 font-normal text-xl rounded focus:ring-blue-500 bg-[#23263a] focus:border-blue-500"
                                            required>
                                            <option value="REFEREE">Referee</option>
                                            <option value="STREAMER">Streamer</option>
                                            <option value="COMMENTATOR">Commentator</option>
                                            <option value="MAPPOOLER">Mappooler</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-2 w-full h-12 font-bold">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className={`text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors ${loading ? 'pointer-events-none opacity-50' : 'cursor-pointer'} flex items-center justify-center`}
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
                    </>
                )}
            </AnimatePresence>
        </>
    );
}