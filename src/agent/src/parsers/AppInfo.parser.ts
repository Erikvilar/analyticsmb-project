export interface AppInfoResult {
    "packageName"?: string,
    "versionName"?: string,
    "versionCode"?: number,
    "minSdk"?: number,
    "targetSdk"?: number,
    "apkPath"?: string,
    "firstInstallTime"?: string,
    "lastUpdateTime"?: string,
    "mainActivity"?: string
}
export function parserAppInfo(raw: string): AppInfoResult {

    const result: AppInfoResult = {};
console.log(raw)
    const pkg = raw.match(/package=(.+)/);
    if(pkg) {
        result.packageName = pkg[0];
    }


    const version = raw.match(/versionName=(.+)/);
    if(version) {
        result.versionName = version[1];
    }


    const versionCode = raw.match(/versionCode=(\d+)/);
    if(versionCode) {
        result.versionCode = Number(versionCode[1]);
    }


    const sdk = raw.match(/minSdk=(\d+)\s+targetSdk=(\d+)/);

    if(sdk) {
        result.minSdk = Number(sdk[1]);
        result.targetSdk = Number(sdk[2]);
    }


    return result;
}