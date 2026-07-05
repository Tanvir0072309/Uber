const RouteLine = ({ className = "" }) => (
    <div
        className={`absolute left-[24px] top-[26px] bottom-[26px] w-[2px] z-10 flex flex-col justify-between items-center pointer-events-none ${className}`}
        aria-hidden="true"
    >
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0" />
        <div className="w-0 flex-1 border-l-2 border-dashed border-neutral-300 my-1" />
        <div className="w-2.5 h-2.5 bg-neutral-900 rounded-[2px] shrink-0" />
    </div>
);

export default RouteLine;
