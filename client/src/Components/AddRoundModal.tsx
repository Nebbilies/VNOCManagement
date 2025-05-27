import {AnimatePresence, motion} from "motion/react";
import {useState} from "react";

interface Props {
    closeAddRoundModal: () => void;
    showMainModal: () => void;
    closeMainModal: () => void;
}

export function AddRoundModal({closeAddRoundModal, showMainModal, closeMainModal}: Props) {
    const [roundName, setRoundName] = useState("");
    const [roundAcronym, setRoundAcronym] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically handle the form submission, e.g., send data to the server
        console.log("Round Name:", roundName);
        console.log("Round Acronym:", roundAcronym);
        closeAddRoundModal();
        showMainModal();
        closeMainModal();
        // Reset form fields
        setRoundName("");
        setRoundAcronym("");
    };
    return (
        <AnimatePresence>
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
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
                                closeAddRoundModal();
                                showMainModal();
                            }}
                            className="text-gray-700 text-2xl bg-gray-200 w-1/2 h-full rounded hover:bg-gray-300 transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`bg-blue-500 text-white text-2xl rounded w-1/2 hover:bg-blue-600 transition-colors `}
                        >
                            Confirm
                        </button>
                    </div>
                </form>
            </motion.div>
        </AnimatePresence>
    )
}