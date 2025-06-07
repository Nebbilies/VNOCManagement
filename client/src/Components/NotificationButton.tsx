import {Bell, Circle} from 'lucide-react';
import {useEffect, useState, useRef} from "react";
import {AnimatePresence, motion} from "motion/react";
import {fetchRescheduleRequests} from "../lib/fetchFunctions.tsx";
import {useUser} from "../context/UserContext.tsx";
import {RescheduleRequest} from "./MatchesComponent.tsx";
import RescheduleNotificationCard from "./RescheduleNotificationCard.tsx";
import {useToast} from "../context/ToastContext.tsx";

interface Props {
    mode: 'pc' | 'mobile';
}

function NotificationButton({mode}: Props) {
    const {user} = useUser();
    let userId = 0;
    if (user) {
        userId = user.id;
    }
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
    const [rescheduleNotifications, setRescheduleNotifications] = useState<RescheduleRequest[]>([]); // Adjust type as needed
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLDivElement>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const {showError} = useToast();
    // Handle clicks outside the notification menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if the click was outside both the menu and the button
            if (
                notificationMenuOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setNotificationMenuOpen(false);
            }
        }

        // Add the event listener
        document.addEventListener("mousedown", handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notificationMenuOpen]);
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;
        fetchRescheduleRequests({signal, status: "APPROVED", playerRespondId: userId})
            .then((data: RescheduleRequest[]) => {
                setRescheduleNotifications(data);
            })
            .catch((error) => {
                if (error.name === 'AbortError') {
                    return;
                }
                console.error("Error fetching reschedule requests:", error);
                showError("An error occurred while fetching notifications. Please try again later or refresh the page.");
            });
        return () => {
            abortController.abort();
        }
    }, [refresh])
    return (
        <div className={'relative'}>
            <motion.div
                ref={buttonRef}
                whileHover={{scale: 1.1}}
                whileTap={{scale: 0.9}}
                transition={{type: "spring", stiffness: 300, duration: 100}}
                className={`${mode === 'mobile' ? 'rounded-full p-2 bg-[#1b1d20]' : ''} cursor-pointer`}
                onClick={() => {
                    setNotificationMenuOpen((v) => !v);
                }}
            >
                {rescheduleNotifications.length > 0 && (
                    <Circle className={'text-red-500 absolute right-0 -top-1'} size={12} strokeWidth={5} absoluteStrokeWidth={false}/>
                )}
                <Bell size={24}/>
            </motion.div>
            <AnimatePresence>
            {notificationMenuOpen && (
                <>
                    <motion.div
                        ref={menuRef}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        exit={{opacity: 0}}
                        transition={{duration: 0.2}}
                        className={'absolute w-48 bg-[#23263a] -left-20 mt-2 z-50 rounded-lg p-2'}
                    >
                        <div className={'notification-container flex flex-col h-60 overflow-y-auto bg-[#1b1d2e]'}>
                            {rescheduleNotifications.map(notification => (
                                <RescheduleNotificationCard rescheduleNotification={notification} setRefresh={setRefresh}/>
                            ))}
                        </div>
                    </motion.div>
                </>
                )
            }
            </AnimatePresence>
        </div>
    )
}

export default NotificationButton