import { Ban } from 'lucide-react';
import { useState } from 'react';
import {AnimatePresence, motion} from "motion/react";

interface Props  {
    matchId: string
}

export function DeleteMatchButton({ matchId }: Props) {
    const [showModal, setShowModal] = useState(false);
    const handleDelete = async () => {
        /*try {
            const response = await fetch(`/api/matches/${matchId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            alert('Match deleted successfully');
        } catch (error) {
            console.error('Error deleting match:', error);
            alert('Failed to delete match');
        }*/
    };

    return (
        <>
            <Ban onClick={() => setShowModal(true)} className="text-red-300 cursor-pointer hover:text-red-400 transition-colors duration-300">
        </Ban>
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
                                        className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-600">Cancel
                                </button>
                                <button onClick={() => {
                                    setShowModal(false)
                                    handleDelete()
                                }} className="px-4 py-2 bg-red-600 rounded hover:bg-red-700">Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence></>
    );
}