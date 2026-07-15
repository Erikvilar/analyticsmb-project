import "./LogcatCard.css";
import useLogcatData  from "../../hooks/useLogcatData";

 function LogcatCard() {

    const {
        lines,

        running,

        mode,

        onlyWarnings,

        start,
        stop,
        clear,

        toggleWarnings,
        toggleMode,

        autoScroll,

    } = useLogcatData();

    return (
        <div className="logcat-card">

            <div className="logcat-card__header">

                <div className="logcat-card__title">

                    <span className="material-symbols-outlined">
                        terminal
                    </span>

                    <span>Live Logcat</span>

                </div>

                <div className="logcat-card__actions">

                    <button
                        className="logcat-card__button"
                        onClick={running ? stop : start}
                    >
                        <span className="material-symbols-outlined">
                            {running ? "pause" : "play_arrow"}
                        </span>
                    </button>

                    <button
                        className={
                            onlyWarnings
                                ? "logcat-card__button logcat-card__button--active"
                                : "logcat-card__button"
                        }
                        onClick={toggleWarnings}
                    >
                        <span className="material-symbols-outlined">
                            warning
                        </span>
                    </button>

                    <button
                        className="logcat-card__button"
                        onClick={toggleMode}
                    >
                        <span className="material-symbols-outlined">
                            {mode === "APP"
                                ? "android"
                                : "public"}
                        </span>
                    </button>

                    <button
                        className="logcat-card__button"
                        onClick={clear}
                    >
                        <span className="material-symbols-outlined">
                            delete
                        </span>
                    </button>

                </div>

            </div>

            <div className="logcat-card__body">

                {
                    lines.length === 0 &&
                    (
                        <div className="logcat-card__empty">

                            Waiting logcat...

                        </div>
                    )
                }

                {
                    lines.map((line,index)=>(
                        <div
                            key={index}
                            className={`logcat-card__line logcat-card__line--${line.level.toLowerCase()}`}
                        >

                            <span className="logcat-card__time">
                                {line.time}
                            </span>

                            <span className="logcat-card__tag">
                                {line.tag}
                            </span>

                            <span className="logcat-card__message">
                                {line.message}
                            </span>

                        </div>
                    ))
                }

            </div>

            <div className="logcat-card__footer">

                <span>

                    {running
                        ? "● Running"
                        : "○ Paused"}

                </span>

                <span>

                    {mode}

                </span>

                <span>

                    {onlyWarnings
                        ? "WARN / ERROR"
                        : "ALL"}

                </span>

                <span>

                    {lines.length} lines

                </span>

                <span>

                    Auto Scroll {autoScroll ? "ON" : "OFF"}

                </span>

            </div>

        </div>
    );

}
export  default LogcatCard;