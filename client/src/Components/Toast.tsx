import {AnimatePresence, motion} from "motion/react";
import {useState, useEffect} from "react";
import {Check, Ban} from "lucide-react";

interface Props {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

function Toast({message, type, onClose}: Props) {
    const [showPrompt, setShowPrompt] = useState(true);

    useEffect(() => {
        setShowPrompt(true);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPrompt(false);
            setTimeout(() => onClose(), 500);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';
    const Icon = isSuccess ? Check : Ban;
    const iconColor = isSuccess ? 'text-green-300' : 'text-red-300';
    const title = isSuccess ? 'Success' : 'Error';

    return (
        <AnimatePresence mode={'wait'}>
            {showPrompt && (
                <motion.div
                    initial={{opacity: 0, x: 400}}
                    animate={{opacity: 1, x: 0}}
                    exit={{opacity: 0, x: 400}}
                    transition={{type: "spring", damping: 25, stiffness: 300, duration: 0.5}}
                    className="fixed bottom-[20px] right-4 transform -translate-y-1/2 rounded-lg p-6 z-50 w-[400px] flex flex-col bg-[#23263a]"
                >
                    <div className={`flex ${iconColor}`}>
                        <Icon/>
                        <div className="text-lg font-bold ml-2">
                            {title}
                        </div>
                    </div>
                    <div className="text-white mt-2">
                        {message}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Toast;
