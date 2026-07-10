import dns from "dns/promises";
const cache = new Map<string,string|null>();

export async function reverseLookup(ip:string){

    if(cache.has(ip)){
        return cache.get(ip)!;
    }

    try {

        const result = await dns.reverse(ip);

        const hostname =
            result[0] ?? null;

        cache.set(ip,hostname);

        return hostname;

    } catch {

        cache.set(ip,null);

        return null;
    }
}