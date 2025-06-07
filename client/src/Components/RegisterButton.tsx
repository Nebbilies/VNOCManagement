import {useState} from "react";
import {useToast} from "../context/ToastContext.tsx";
import {AnimatePresence, motion} from "motion/react";
import {useUser} from "../context/UserContext.tsx";

export function RegisterButton() {
    const apiBase = import.meta.env.VITE_API_BASE_URL
    const { user } = useUser()
    const {showSuccess, showError} = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const userRole = user?.role || 'UNREGISTERED';
    const register = async() =>{
        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/players/add`, {
                credentials: 'include',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                showError(errorData.error || 'Failed to register');
                setTimeout(() => {
                    setLoading(false);
                }, 4000);
                throw new Error('Network response was not ok');
            }
            showSuccess('Registration successful! Reloading...');
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
            catch (error) {
                console.error('Error during registration:', error);
            }
        setIsModalOpen(false);

    }
    return (
        userRole == "GUEST" &&
            <>
                <button
                    className={"bg-green-500 text-white flex items-center cursor-pointer font-bold py-3 px-6 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300"}
                    onClick={() => setIsModalOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 4h10v14a2 2 0 0 1-2 2H9m3-5l3-3m0 0l-3-3m3 3H5"/>
                    </svg>
                    <span className={"ml-2"}>Register</span>
                </button>
                <AnimatePresence>
                    {isModalOpen && (
                        <>
                            <motion.div
                                initial={{opacity: 0}}
                                animate={{opacity: 0.6}}
                                exit={{opacity: 0}}
                                className="fixed inset-0 bg-gray-600 blur-xl z-40"
                                onClick={() => {
                                    setIsModalOpen(false);
                                }}/>

                            <motion.div
                                initial={{opacity: 0, scale: 0.9, y: 20}}
                                animate={{opacity: 1, scale: 1, y: 0}}
                                exit={{opacity: 0, scale: 0.9, y: 20}}
                                transition={{type: "spring", damping: 25, stiffness: 300}}
                                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg p-6 z-50 w-96"
                            >
                                <div className="bg-[#23263a] rounded-lg p-6 text-white">
                                    <div>Are you sure you want to register for <b>Vietnam osu! Championship</b>?</div>
                                    <div className="mt-4 flex gap-3">
                                        <button onClick={() => setIsModalOpen(false)}
                                                className={`px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                            Cancel
                                        </button>
                                        <button onClick={() => {
                                            register()
                                        }}
                                                className={`px-4 py-2 bg-green-500 rounded hover:bg-green-600 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
    )
}