import {Staff} from "./StaffComponent.tsx";
import {useState} from "react";
import {AnimatePresence, motion} from "motion/react";
import {Trash2} from "lucide-react";
import {useToast} from "../context/ToastContext.tsx";

const hidden = {opacity: 0, x: 0, y: -10}
const enter = {opacity: 1, x: 0, y: 0}
const exit = {opacity: 0, x: 0, y: -10}

interface Props {
    staffList: Staff[]
    toggleRefresh: (refresh: boolean) => void;
}


function StaffGrid({staffList, toggleRefresh}: Props) {
    const [hoveredStaff, setHoveredStaff] = useState(0)
    const [deleteStaff, setDeleteStaff] = useState<number>()
    const [loading, setLoading] = useState(false);
    const {showSuccess, showError} = useToast();
    const onDeleteStaff = async (staffId: number) => {
        setLoading(true);
        const response = await fetch(`http://localhost:3001/api/staff/remove/${staffId}`, {
            credentials: 'include',
            method: 'DELETE',
        });
        if (!response.ok) {
            const errorData = await response.json();
            showError(errorData);
            throw new Error('Network response was not ok');
        }
        showSuccess(`Staff ${staffId} deleted successfully!`);
        toggleRefresh(true);
        setDeleteStaff(0);
        setTimeout(
            () => {
                setLoading(false);
            },
            4000
        )
    }
    return (
        <div className={'grid grid-cols-[repeat(auto-fill,150px)] w-full gap-4'}>
            {staffList.map((staff, index) => (
                <motion.div className={'h-full w-full'}
                            key={staff.Id}
                            initial={hidden}
                            animate={enter}
                            exit={exit}
                            transition={{type: "spring", duration: 0.6, ease: "easeInOut", delay: index * 0.05}}>
                    <motion.div
                        whileHover={{scale: 1.05}}
                        onMouseEnter={() => setHoveredStaff(staff.Id)}
                        onMouseLeave={() => setHoveredStaff(0)}
                        key={staff.Id}
                        className="player-card bg-[#131724] border-8 border-[#353d60] rounded-[12px] flex flex-col w-full relative">
                        {hoveredStaff === staff.Id && (
                            <button
                                onClick={() =>
                                    setDeleteStaff(staff.Id)
                                }
                                className="absolute top-1.5 right-2 z-10 bg-[#0e111a] rounded-full p-2 hover:bg-red-900 transition-colors"
                                aria-label="Delete player"
                            >
                                <Trash2 className="w-5 h-5 text-white"/>
                            </button>
                        )}
                        <div
                            className={"text-center px-2 py-3 truncate inline overflow-hidden text-md font-bold w-full border-b-8 border-[#353d60]"}>
                            {staff.Username}
                        </div>
                        <div className={`player-info w-full relative cursor-pointer`} onClick={() => {
                            window.open(`https://osu.ppy.sh/users/${staff.Id}`, "_blank")
                        }}>
                            <img alt="player avatar" src={`https://a.ppy.sh/${staff.Id}`}
                                 className={"w-full aspect-auto rounded-b-[5px] "}/>

                        </div>
                    </motion.div>
                    {/* Confirmation modal */}
                    <AnimatePresence>
                        {deleteStaff == staff.Id && (
                            <>
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 0.6}}
                                    exit={{opacity: 0}}
                                    className="fixed inset-0 bg-gray-600 blur-xl z-40"
                                    onClick={() => {
                                        setDeleteStaff(0)
                                    }}
                                />

                                <motion.div
                                    initial={{opacity: 0, scale: 0.9, y: 20}}
                                    animate={{opacity: 1, scale: 1, y: 0}}
                                    exit={{opacity: 0, scale: 0.9, y: 20}}
                                    transition={{type: "spring", damping: 25, stiffness: 300}}
                                    className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 z-50 w-96"
                                >
                                    <div className="bg-[#23263a] rounded-lg p-6 text-white">
                                        <div>Are you sure you want to delete <b>{staff.Username}</b>?</div>
                                        <div className="mt-4 flex gap-3">
                                            <button onClick={() =>
                                                setDeleteStaff(0)
                                            }
                                                    className={`px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                                Cancel
                                            </button>
                                            <button onClick={() => {
                                                onDeleteStaff(staff.Id);
                                            }}
                                                    className={`px-4 py-2 bg-red-600 rounded hover:bg-red-700 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                    {/*-----------*/}
                </motion.div>
            ))}
        </div>

    )
}

export default StaffGrid;