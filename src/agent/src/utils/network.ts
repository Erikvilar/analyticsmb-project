export function extractAddress(value: string): [string, number | null] {

    value = value.trim();

    // Remove []
    value = value.replace("[", "").replace("]", "");

    // Alguns retornos possuem "https" ou "http"
    value = value.replace(":https", ":443");
    value = value.replace(":http", ":80");

    const index = value.lastIndexOf(":");

    if (index === -1) {
        return [value, null];
    }

    const ip = value.substring(0, index);

    const port = Number(value.substring(index + 1));

    return [
        ip,
        Number.isNaN(port) ? null : port
    ];

}