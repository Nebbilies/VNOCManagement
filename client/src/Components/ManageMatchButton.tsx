import {SlidersHorizontal} from 'lucide-react';
import {AnimatePresence, motion} from "motion/react";
import {useState} from "react";
import {TourneyRoundsModal} from "./TourneyRoundsModal.tsx";
import {RescheduleRequestsModal} from "./RescheduleRequestsModal.tsx";

export function ManageMatchButton() {
    const [hoveringAddMatch, setHoveringAddMatch] = useState(false);
    const [isMainModalOpen, setIsMainModalOpen] = useState(false);
    const openMainModal = () => {
        setIsMainModalOpen(true);
    };
    const closeMainModal = () => {
        setIsMainModalOpen(false);
    };
    return (
        <>
            <div onMouseEnter={() => setHoveringAddMatch(true)}
                 onMouseLeave={() => setHoveringAddMatch(false)}
                 className="text-white font-bold w-fit h-1/2 cursor-pointer rounded-full transition-colors duration-300 flex justify-center items-center">
                <SlidersHorizontal className={'h-full w-auto'}
                                   onClick={openMainModal}
                >
                </SlidersHorizontal>
                <AnimatePresence>
                    {hoveringAddMatch && (
                        <motion.div
                            initial={{opacity: 0, y: -10}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -10}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className="absolute text-white text-sm p-2 rounded-md mt-2 translate-y-[-150%] bg-gray-800 shadow-lg z-50"
                        >
                            Manage
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <AnimatePresence>
                {isMainModalOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 0.6}}
                            exit={{opacity: 0}}
                            className="fixed inset-0 bg-gray-700 blur-l z-40"
                            onClick={() => {
                                closeMainModal()
                            }}
                        />
                        <motion.div
                            initial={{opacity: 0, scale: 0.9, y: 20}}
                            animate={{opacity: 1, scale: 1, y: 0}}
                            exit={{opacity: 0, scale: 0.9, y: 20}}
                            transition={{type: "spring", damping: 25, stiffness: 300}}
                            className={`fixed flex md:flex-row flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  z-50 w-2/3 sm:w-4/5 lg:w-3/5 xl:w-1/2 justify-between gap-4`}
                        >
                                    <TourneyRoundsModal/>
                                    <RescheduleRequestsModal/>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>

    );
}