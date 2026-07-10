interface IpProvider {
    prefix: string;
    provider: string;
    service?: string;
}


const IP_DATABASE: IpProvider[] = [

    {
        prefix: "142.250.",
        provider: "Google",
        service: "Google/Firebase"
    },

    {
        prefix: "34.120.",
        provider: "Google",
        service: "Google Cloud"
    },

    {
        prefix: "31.13.",
        provider: "Meta",
        service: "Facebook/Instagram"
    },

    {
        prefix: "3.",
        provider: "Amazon",
        service: "AWS"
    },

    {
        prefix: "52.",
        provider: "Amazon",
        service: "AWS"
    },

    {
        prefix: "104.16.",
        provider: "Cloudflare"
    },

    {
        prefix: "104.17.",
        provider: "Cloudflare"
    },

    {
        prefix: "104.18.",
        provider: "Cloudflare"
    },

    {
        prefix: "35.",
        provider: "Google",
        service: "Google Cloud"
    }

];


export function lookupIp(ip:string){

    const result = IP_DATABASE.find(item =>
        ip.startsWith(item.prefix)
    );


    if(!result){

        return {
            provider:"Unknown",
            service:"Unknown"
        };

    }


    return {
        provider:result.provider,
        service:result.service ?? "Unknown"
    };

}