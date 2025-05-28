
export function Loading() {
    return (
        <div className="flex flex-col w-full justify-center items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24">
                <circle cx="18" cy="12" r="0" fill="currentColor">
                    <animate attributeName="r" begin=".67" calcMode="spline" dur="1.5s"
                             keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                             repeatCount="indefinite" values="0;2;0;0"/>
                </circle>
                <circle cx="12" cy="12" r="0" fill="currentColor">
                    <animate attributeName="r" begin=".33" calcMode="spline" dur="1.5s"
                             keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                             repeatCount="indefinite" values="0;2;0;0"/>
                </circle>
                <circle cx="6" cy="12" r="0" fill="currentColor">
                    <animate attributeName="r" begin="0" calcMode="spline" dur="1.5s"
                             keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8"
                             repeatCount="indefinite" values="0;2;0;0"/>
                </circle>
            </svg>
            <span className={`font-bold text-3xl text-center italic`}>
                        Loading...
                    </span>
        </div>
    )
}