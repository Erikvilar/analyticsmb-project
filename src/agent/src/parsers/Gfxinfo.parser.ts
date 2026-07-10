export interface GfxinfoResult {
    totalFramesRendered?: number;
    jankyFrames?: {
        count: number;
        percent: number;
    };
    percentiles?: {
        p50?: number;
        p90?: number;
        p95?: number;
        p99?: number;
    };
}


const numFrom = (
    regex: RegExp,
    raw: string
): number | undefined => {

    const match = raw.match(regex);

    return match
        ? Number(match[1].replace(/,/g, ""))
        : undefined;
};



export function parseGfxinfo(raw: string): GfxinfoResult {

    const result: GfxinfoResult = {};


    result.totalFramesRendered =
        numFrom(
            /Total frames rendered:\s*([\d,]+)/i,
            raw
        );


    const janky =
        raw.match(
            /Janky frames:\s*([\d,]+)\s*\(([\d.]+)%\)/i
        );


    if (janky) {

        result.jankyFrames = {

            count:
                Number(
                    janky[1].replace(/,/g, "")
                ),

            percent:
                Number(janky[2])
        };

    }



    result.percentiles = {

        p50:
            numFrom(
                /50th percentile:\s*([\d.]+)ms/i,
                raw
            ),

        p90:
            numFrom(
                /90th percentile:\s*([\d.]+)ms/i,
                raw
            ),

        p95:
            numFrom(
                /95th percentile:\s*([\d.]+)ms/i,
                raw
            ),

        p99:
            numFrom(
                /99th percentile:\s*([\d.]+)ms/i,
                raw
            )

    };


    return result;
}