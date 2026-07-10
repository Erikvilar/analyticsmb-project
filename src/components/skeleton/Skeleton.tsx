type SkeletonCardProps = {
    gridSpan?: number;
    variant?: "gauge" | "chart" | "text";
    showStatus?: boolean;
    className?: string;
};

function Skeleton({
                          gridSpan = 4,
                          variant = "gauge",
                          showStatus = true,
                          className = "",
                      }: Readonly<SkeletonCardProps>) {
    return (
        <div
            className={`skeleton-card ${className}`}
            style={{ gridColumn: `span ${gridSpan}` }}
            aria-hidden="true"
        >
            <div className="skeleton-card__header">
                <div className="skeleton shimmer skeleton-card__title" />
                <div className="skeleton shimmer skeleton-card__icon" />
            </div>

            <div className="skeleton-card__body">
                {variant === "gauge" && (
                    <div className="skeleton-card__gauge-wrap">
                        <div className="skeleton shimmer skeleton-card__gauge" />
                        <div className="skeleton shimmer skeleton-card__gauge-value" />
                    </div>
                )}

                {variant === "chart" && (
                    <div className="skeleton shimmer skeleton-card__chart" />
                )}

                {variant === "text" && (
                    <div className="skeleton-card__text-lines">
                        <div className="skeleton shimmer skeleton-card__line" style={{ width: "80%" }} />
                        <div className="skeleton shimmer skeleton-card__line" style={{ width: "60%" }} />
                        <div className="skeleton shimmer skeleton-card__line" style={{ width: "70%" }} />
                    </div>
                )}
            </div>

            {showStatus && (
                <div className="skeleton-card__status">
                    <div className="skeleton shimmer skeleton-card__dot" />
                    <div className="skeleton shimmer skeleton-card__threshold" />
                </div>
            )}
        </div>
    );
}

export default Skeleton;