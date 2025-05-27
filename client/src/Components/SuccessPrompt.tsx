import {AnimatePresence, motion} from "motion/react";
import {Check} from 'lucide-react';
import {useState} from "react";

interface Props {
    message: string;
}

function SuccessPrompt({message}: Props) {
    const [showPrompt, setShowPrompt] = useState(true);
    const handleClose = () => {
        setShowPrompt(false);
    };
    setTimeout(() => {
        handleClose();
    }, 3000);
    return (

        <AnimatePresence>
            {showPrompt &&
            (
            <motion.div
                initial={{opacity: 0, x: 400}}
                animate={{opacity: 1, x: 0}}
                exit={{opacity: 0, x: 400}}
                transition={{type: "spring", damping: 25, stiffness: 300, duration: 0.5}}
                className="fixed bottom-[20px] right-4 transform -translate-y-1/2 rounded-lg p-6 z-50 w-[400px] flex flex-col bg-[#23263a]"
            >
                <div className={'flex text-green-300'}>
                    <Check/>
                    <div className="text-lg font-bold ml-2">
                        Success
                    </div>
                </div>
                <div className="text-white mt-2">
                    {message}
                </div>
            </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SuccessPrompt;