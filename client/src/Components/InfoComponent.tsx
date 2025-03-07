import { motion } from 'framer-motion'
import { variants } from "../lib/variants.tsx";

function InfoComponent() {
    const hrbreak = {
        borderBottom: "4px solid #ffffff",
        width: "100%",
        margin: "0 auto",
        marginTop: "1rem",
    }
    const redText = {
        color: "#ff6467",
        fontWeight: "bold",
    }
    return (
        <motion.div
            initial={"hidden"}
            animate={"enter"}
            exit={"exit"}
            variants={variants}
            transition={{type: "tween", duration: 1}}
            className={"relative flex flex-col max-w-screen h-auto px-4 lg:px-8 mt-40 mb-20 pt-5 pb-10 md:mx-16 lg:mx-32 xl:mx-64 mx-4 self-center bg-gray-900/50 text-white"}>
            <p className={"text-lg self-center px-4 md:px-12 lg:px-24"}>
                <span className={"font-bold text-red-400"}>Vietnam osu! Championship</span> là giải đấu osu!standard lớn nhất,
                danh giá nhất tại Việt Nam. Được tổ chức bởi <span className={"font-bold text-red-400"}>Vietnam Community League</span>,
                giải đấu quy tụ những người chơi tài năng nhất trên toàn quốc, hứa hẹn sẽ mang đến những trận đấu kịch tính và hấp dẫn.
            </p>
            <h1 className={"text-6xl font-black italic mt-10"}>Thông tin chung</h1>
            <div style={hrbreak}/>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li className={""}>
                    <span style={redText}>Vietnam osu! Championship</span> là giải đấu osu! standard theo thể thức Head-to-Head 1v1.
                    Score V2 và NF sẽ được áp dụng cho mọi map trong giải.
                </li>
                <li className={"mt-1"}>
                    <span style={redText}>Giải dành riêng cho những người chơi có cờ Việt Nam trên profile và không có ngoại lệ.</span>
                </li>
                <li className={"mt-1"}>
                    Giải đấu không có giới hạn về rank đối với người tham gia.
                </li>
                <li className={"mt-1"}>
                    Quá trình <span style={redText}>Screening</span> sẽ được thực hiện bởi osu! staff để đảm bảo người chơi không vi phạm
                    các quy định hiện có của osu! và đủ điều kiện tham gia giải đấu.
                </li>
                <li className={"mt-1"}>
                    <span style={redText}>Vòng sơ loại (Qualifiers)</span> sẽ được áp dụng để chọn ra 32 người chơi tốt
                    nhất được tiến vào vòng thi đấu chính thức của giải.
                </li>
                <li className={"mt-1"}>
                    Khác với những giải đấu truyền thống trong và ngoài nước, VNOC5 sẽ áp dụng thể thức mở rộng hơn,
                    gồm 5 lượt thi đấu trong vòng Thuỵ Sĩ (Swiss) và 4 lượt thi đấu trong vòng loại trực tiếp (Knockout).
                    Thông tin chi tiết có trong phẩn <span className={"font-bold"}> THỂ THỨC</span>
                </li>
                <li className={"mt-1"}>
                    Trong suốt quá trình tham gia giải, người chơi bắt buộc phải có mặt trong server Discord.
                    Rời server trong quá trình tham gia đồng nghĩa với việc người chơi chấp nhận việc bị loại khỏi giải.
                </li>
                <li className={"mt-1"}>
                    Khác với những mùa trước, người chơi vô địch mùa giải VNOC gần nhất <span style={redText}>được tham gia</span>
                    , vì thời gian nghỉ giữa 2 mùa giải dài hơn bình thường.
                </li>
                <li className={"mt-1"}>
                    Staff của giải không được tham gia giải đấu, với ngoại lệ gồm <span style={redText}>Streamer</span>,
                    <span style={redText}> Commentator</span> và <span style={redText}>GFX</span>.
                    Người chơi bị loại có thể đăng ký làm Playtester hoặc Referee.
                </li>
            </ul>
            <h1 className={"text-6xl font-black italic mt-10"}>Phần thưởng</h1>
            <div style={hrbreak}/>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li><span style={redText} className={"text-xl"}>Champion</span>:</li>
                <ul className={"list- mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - 50% tiền donate từ cộng đồng
                    </li>
                    <li className={"mt-1"}>
                        - 1 năm osu!supporter
                    </li>
                    <li className={"mt-1"}>
                        - Profile badge
                    </li>
                    <li className={"mt-1"}>
                        - Profile banner
                    </li>
                    <li className={"mt-1"}>
                        - 1x áo VNOC kèm custom
                    </li>
                    <li className={"mt-1"}>
                        - 1x Keypad Wooting UWU - được tài trợ bởi Wooting
                    </li>
                    <li className={"mt-1"}>
                        - Gói quà tặng nhà vô địch
                    </li>
                </ul>
                <li><span style={redText} className={"text-xl"}>Runner-up</span>:</li>
                <ul className={"list- mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - 30% tiền donate từ cộng đồng
                    </li>
                    <li className={"mt-1"}>
                        - 6 tháng osu!supporter
                    </li>
                    <li className={"mt-1"}>
                        - Profile banner
                    </li>
                    <li className={"mt-1"}>
                        - 1x áo VNOC kèm custom
                    </li>
                    <li className={"mt-1"}>
                        - Gói quà tặng á quân
                    </li>
                </ul>
                <li><span style={redText} className={"text-xl"}>Top 3</span>:</li>
                <ul className={"list- mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - 20% tiền donate từ cộng đồng
                    </li>
                    <li className={"mt-1"}>
                        - 4 tháng osu!supporter
                    </li>
                    <li className={"mt-1"}>
                        - Profile banner
                    </li>
                    <li className={"mt-1"}>
                        - 1x áo VNOC kèm custom
                    </li>
                    <li className={"mt-1"}>
                        - Gói quà tặng top 3
                    </li>
                </ul>
            </ul>
            <h1 className={"text-6xl font-black italic mt-10"}>Thể thức vòng loại</h1>
            <div style={hrbreak}/>
            <ul className={"list-disc list-inside mt-5 px-6 "}>
                <li className={"mt-1"}>
                    Người chơi cần chọn tham gia 1 lobby trong danh sách thời gian đã định bởi BTC,
                    hoặc có thể yêu cầu lobby với thời gian riêng trong thời hạn cho phép.
                </li>
                <li className={"mt-1"}>
                    10 phút trước giờ bắt đầu, trọng tài sẽ gửi lời mời tới người chơi.
                </li>
                <li className={"mt-1"}>
                    Mappool Qualifiers gồm <span style={redText}>10 maps (3 NM / 2 HD / 2 HR / 3 DT)</span> sẽ được chơi
                    1 lần duy nhất,
                    theo đúng thứ tự đã được công bố.
                </li>
                <li className={"mt-1"}>
                    Người chơi được yêu cầu hoàn thành toàn bộ các map có trong pool.
                </li>
                <li className={"mt-1"}>
                    Vòng loại sẽ sử dụng cách tính xếp hạng <span style={redText}>z-sum</span> để lấy <span style={redText}> top 32 người chơi tốt nhất.</span>
                </li>
            </ul>
            <h1 className={"text-6xl font-black italic mt-10"}>Thể thức vòng trong</h1>
            <div style={hrbreak}/>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li className={"mt-1"}>
                    10 phút trước giờ bắt đầu, trọng tài sẽ gửi lời mời tới người chơi.
                </li>
                <li className={"mt-1"}>
                    <span style={redText}>Giải sẽ không có warmup trước trận đấu, người chơi sẽ tự warmup trước khi vào lobby.</span>
                </li>
                <li className={"mt-1"}>
                    <span style={redText}>Tương tự VNOC4, giải đấu sẽ có lượt Protect - bảo vệ map khỏi việc bị cấm</span>.
                </li>
                <li className={"mt-1"}>
                    Trước khi bắt đầu lượt ban pick, người chơi cần dùng lệnh !roll để xác định thứ tự.
                    Bên thắng roll có quyền chọn thứ tự pick hoặc thứ tự ban,
                    bên thua có quyền chọn thứ tự còn lại.
                    Bên ban trước có quyền protect trước.
                    Lượt protect sẽ tiến hành trước lượt ban pick.
                    <div className={"text-sm px-4 mt-1"}>
                        <span className={"text-red-400 font-bold underline"}>VD:</span> T1 roll 99, T2 roll 100. T2 có quyền chọn 1 trong các thứ tự sau: 1st pick / 1st ban / 2nd pick / 2nd ban.
                        Nếu T2 chọn 2nd pick, T1 có quyền chọn 1st ban hoặc 2nd ban.
                    </div>
                </li>
                <li className={"mt-1"}>
                    Mỗi người chơi có 1 lượt ban (Swiss) hoặc 2 lượt ban (Knockout). Với 2 lượt ban,
                    <span style={redText}> người chơi được quyền ban map trong cùng mod pool</span>.
                </li>
                <li className={"mt-1"}>
                    <span style={redText}>Lượt ban thứ 2 sẽ được triển khai sau khi chơi 4 map (2 pick/người chơi)</span>.
                </li>
                <li className={"mt-1"}>
                    Với mọi lượt ban/pick cũng như chờ sẵn sàng, người chơi có tối đa 90 giây.
                    Trong lượt ban/pick, nếu vượt quá timer trên thì trọng tài sẽ dùng lệnh roll để xác định map sẽ
                    ban/pick.
                    <div className={"mt-1 px-4 text-sm"}>
                        Đối với lượt vi phạm đầu tiên: cảnh cáo.
                    </div>
                    <div className={"mt-1 px-4 text-sm"}>
                        Từ lần vi phạm thứ 2: Referee sẽ dùng lệnh !roll &lt;số map còn lại&gt; dể chọn ra map tiếp theo được ban/pick.
                        Thứ tự ban pick sau đó không thay đổi.
                    </div>
                </li>
                <li className={"mt-1"}>
                    Người chơi có toàn quyền chọn map có trong pool theo bất cứ trình tự nào (trừ map đã bị ban hoặc Tiebreaker).
                </li>
                <li className={"mt-1"}>
                    Mỗi người chơi có quyền yêu cầu 1 lượt abort mỗi trận (riêng GF là 2)
                    nếu gặp vấn đề bất khả kháng trong 15 giây đầu hoặc ¼ đầu tiên (tuỳ vào khoảng thời gian nào dài hơn) trong map.
                </li>
            </ul>
            <h2 className={"text-4xl font-extrabold mt-5"}>Tiebreaker</h2>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li className={"mt-1"}>
                    Khi trận đấu tiến tới tỉ số hoà sau map pick cuối cùng của cả 2 người chơi, map Tiebreaker sẽ được chọn.
                </li>
                <li className={"mt-1"}>
                    Trong map TB, người chơi có quyền pick một hoặc nhiều hơn trong tổ hợp mod cho phép: HD, HR, EZ, FL (EZ có hệ số điểm x1.8).
                </li>
                <li className={"mt-1"}>
                    Người chơi thắng trong lượt TB sẽ thắng cả trận đấu.
                </li>
            </ul>
            <h2 className={"text-4xl font-extrabold mt-5"}>Xếp lịch</h2>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li className={"mt-1"}>
                    Mọi vòng sẽ có lịch thi đấu do BTC đưa ra. Nếu không thể tham gia theo giờ đã định trước,
                    người chơi có quyền được yêu cầu thay đổi lịch.
                </li>
                <li className={"mt-1"}>
                    Giới hạn của lịch trận đấu từ thứ 5 của tuần tương ứng tới thứ 2 tuần tiếp theo.
                </li>
                <li className={"mt-1"}>
                    Nếu gặp bất cứ vấn đề nào trong việc yêu cầu thời gian mới với đối thủ,
                    người chơi cần báo ngay cho BTC trong thời gian sớm nhất để được hỗ trợ.
                </li>
                <li className={"mt-1"}>
                    Yêu cầu đổi lịch phải được thông báo 2 tiếng trước giờ bắt đầu, ngoài trường hợp bất khả kháng.
                </li>
            </ul>
            <h2 className={"text-4xl font-extrabold mt-5"}>Ngắt kết nối</h2>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li className={"mt-1"}>
                    Vòng loại
                </li>
                <ul className={"list-inside mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - Ngắt kết nối trước ¼ map: Chơi lại map sau khi hoàn thành mappool.
                    </li>
                    <li className={"mt-1"}>
                        - Sau ¼ map: tính điểm như bình thường.
                    </li>
                    <li className={"mt-1"}>
                        - Ngắt kết nối và không có phản hồi với các map sau: Áp dụng xử phạt vắng mặt.
                    </li>
                </ul>
                <li className={"mt-1"}>
                    Vòng trong
                </li>
                <ul className={"list-inside mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - Ngắt kết nối trước 30s: Chơi lại map (1 lần/map và 2 lần/trận).
                    </li>
                    <li className={"mt-1"}>
                        - Ngắt kết nối sau 30s: Tính điểm bình thường.
                    </li>
                    <li className={"mt-1"}>
                        - Ngắt kết nối và không có phản hồi các map sau: Xử thua, trừ trường hợp đặc biệt.
                    </li>
                </ul>
            </ul>
            <h2 className={"text-4xl font-extrabold mt-5"}>Xử phạt vắng mặt</h2>
            <ul className={"list-disc list-inside mt-5 px-6"}>
                <li className={"mt-1"}>
                    Vòng loại
                </li>
                <ul className={"list-inside mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - Người chơi có quyền thay đổi sang lobby khác trước khi hết thời gian Qualifiers.
                    </li>
                </ul>
                <li className={"mt-1"}>
                    Vòng trong
                </li>
                <ul className={"list-inside mt-1 px-6"}>
                    <li className={"mt-1"}>
                        - Hết 5p đầu sau khi thời gian bắt đầu: người chơi mất quyền ban map.
                        Thay vào đó, trọng tài sẽ dùng lệnh roll để xác định
                        map ban.
                    </li>
                    <li className={"mt-1"}>
                        - 10p sau khi thời gian bắt đầu: Xử thua người chơi vắng mặt.
                        <div className={"italic mt-2"}>Trong trường hợp cả 2 người chơi đều vắng mặt,
                            người chơi có xếp hạng vòng loại cao hơn được đi tiếp (win by default).</div>
                    </li>
                </ul>
            </ul>
        </motion.div>
    )
}


export default InfoComponent;