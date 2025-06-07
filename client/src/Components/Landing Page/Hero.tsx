import bg from '../../assets/vnoctb.mp4'
import vnoc2024 from '../../assets/vnoc_2024.png'
import vcl from '../../assets/vcl.png'
import { motion } from 'framer-motion'
import { variants } from "../../lib/variants.tsx";
import {RegisterButton} from "./RegisterButton.tsx";

function Hero() {
    return (
        <>
            <div className="absolute inset-0 bg-gradient-to-t from-black from-20% to-transparent opacity-90 w-full h-full -z-50"></div>
            <video autoPlay muted loop id="heroBg"
                   className="absolute inset-0 w-full h-full object-cover opacity-30 -z-999" src={bg}/>
            <motion.main className={"relative w-screen h-screen flex flex-col justify-center items-center"}>
                <motion.img src={vnoc2024} alt="logo" className="md:w-2/3 lg:w-1/2 w-full flex shrink-2"
                            initial={"hidden"}
                            animate={"enter"}
                            exit={"exit"}
                            variants={variants}
                            transition={{type: "spring", duration: 1.3, ease: "easeInOut"}}
                />
                <motion.h1 className={"text-white text-2xl md:text-3xl lg:text-4xl text-center font-bold italic pt-8 tracking-wide"}
                           initial={"hidden"}
                           animate={"enter"}
                           exit={"exit"}
                           variants={variants}
                           transition={{type: "spring", duration: 1.3, ease: "easeInOut", delay: 0.2}}
                >
                    Giải đấu osu!standard hàng đầu Việt Nam.
                </motion.h1>
                <motion.div className={"flex space-x-4 pt-4 items-center justify-center"}
                            initial={"hidden"}
                            animate={"enter"}
                            exit={"exit"}
                            variants={variants}
                            transition={{type: "spring", duration: 1.3, ease: "easeInOut", delay: 0.4}}
                >
                    <h2 className={"font-normal italic text-white text-xl md:text-2xl lg:text-3xl"}>Được tổ chức bởi</h2>
                    <motion.img src={vcl} alt="vcl" className="w-1/4 pl-4 duration-200" whileHover={{scale: 1.05}}/>
                </motion.div>
                <motion.div className={"flex gap-4 items-center justify-center pt-8"}
                            initial={"hidden"}
                            animate={"enter"}
                            exit={"exit"}
                            variants={variants}
                            transition={{type: "spring", duration: 1.3, ease: "easeInOut", delay: 0.6}}>
                    <button
                        className={"bg-[#ee6da7] text-white cursor-pointer flex items-center font-bold py-3 px-6 rounded-full shadow-lg hover:bg-[#dc4c8c] transition-colors duration-300"}
                        onClick={() => window.open("https://osu.ppy.sh/community/forums/topics/1945196", "_blank")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M7.698 10.362a1.94 1.94 0 0 0-.7-.516q-.421-.189-.988-.189c-.567 0-.704.063-.982.189s-.51.298-.692.516q-.273.328-.413.777q-.139.448-.139.96q0 .511.14.952q.139.44.412.767q.274.329.692.512t.982.184c.565 0 .707-.062.988-.184q.422-.184.7-.512q.279-.327.413-.767q.135-.44.135-.952a3.3 3.3 0 0 0-.135-.96a2.1 2.1 0 0 0-.413-.777m-.965 2.81q-.22.372-.723.372q-.494 0-.713-.372q-.22-.373-.22-1.073c0-.7.073-.824.22-1.073q.22-.372.713-.372q.503 0 .723.372q.22.373.22 1.073t-.22 1.073m11.89-.83l-.09-4.39a4.5 4.5 0 0 1 .69-.054q.351 0 .701.054l-.09 4.39q-.315.053-.601.053a3.5 3.5 0 0 1-.61-.054m1.319 1.4q0 .332-.054.664a4 4 0 0 1-.655.054a4 4 0 0 1-.664-.054a4 4 0 0 1-.054-.655q0-.323.054-.665a4 4 0 0 1 .655-.054q.323 0 .664.054q.054.341.054.656m-3.223-4.03q.315 0 .638.053v4.461q-.288.099-.759.193a5.3 5.3 0 0 1-1.863.023a1.7 1.7 0 0 1-.74-.305q-.32-.234-.507-.683q-.189-.449-.189-1.193V9.765a4 4 0 0 1 .638-.054q.313 0 .637.054v2.46q0 .367.058.606a.9.9 0 0 0 .18.377a.66.66 0 0 0 .3.197q.18.058.422.058q.332 0 .557-.062V9.765a4 4 0 0 1 .628-.054m-4.362 2.683q.08.225.08.548a1.4 1.4 0 0 1-.542 1.117q-.265.212-.642.333q-.378.12-.853.12a5 5 0 0 1-.395-.013a3 3 0 0 1-.346-.045a4 4 0 0 1-.327-.076a4 4 0 0 1-.35-.116a2.6 2.6 0 0 1 .085-.49a3 3 0 0 1 .175-.48q.296.117.561.175q.265.06.552.059q.126 0 .274-.023a1 1 0 0 0 .274-.08a.7.7 0 0 0 .21-.153a.35.35 0 0 0 .086-.247q0-.216-.13-.31a1.3 1.3 0 0 0-.364-.166l-.556-.162q-.503-.143-.786-.426q-.282-.283-.283-.848q0-.682.49-1.068q.489-.386 1.332-.386q.35 0 .692.062q.341.063.691.189a2.5 2.5 0 0 1-.09.485a2.3 2.3 0 0 1-.17.44a4 4 0 0 0-.476-.158a2.2 2.2 0 0 0-.548-.067q-.305 0-.476.094a.32.32 0 0 0-.17.301q0 .197.121.278t.346.153l.511.153q.252.072.454.175t.345.255t.225.377M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12c6.628 0 12-5.373 12-12S18.628 0 12 0m0 22.8C6.035 22.8 1.2 17.965 1.2 12S6.035 1.2 12 1.2S22.8 6.035 22.8 12S17.965 22.8 12 22.8"/>
                        </svg>
                        <span className={"ml-2"}>Forum Post</span>
                    </button>
                    <RegisterButton/>
                </motion.div>

            </motion.main>
        </>
    )
}

export default Hero