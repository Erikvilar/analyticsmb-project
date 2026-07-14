export const ADB_COMMANDS = {

    meminfo: (pkg: string) =>
        `adb shell "dumpsys meminfo ${pkg} | grep -E 'Native Heap|Java Heap|Graphics|TOTAL'"`,

    processes:()=> `adb shell pm list packages --user 0 -3`,

    procMeminfo: () =>
        `adb shell "cat /proc/meminfo"`,

    gfxinfo: (pkg: string) =>
        `adb shell "dumpsys gfxinfo ${pkg} | grep -E 'Total frames rendered|Janky frames|50th percentile|90th percentile|95th percentile|99th percentile'"`,

    cpu: (pkg: string) =>
        `adb shell "dumpsys cpuinfo | grep ${pkg} || true"`,

    battery: () =>
        `adb shell "dumpsys battery | grep -E 'level|temperature|status|health' || true"`,

    pid: (pkg: string) =>
        `adb shell pidof ${pkg}`,

    network: () =>
        `adb shell "ss -tun | grep ESTAB || true"`,

    appinfo: (pkg: string) =>
        `adb shell "echo package=${pkg}; \
dumpsys package ${pkg} | grep versionName; \
dumpsys package ${pkg} | grep versionCode; \
dumpsys package ${pkg} | grep firstInstallTime; \
dumpsys package ${pkg} | grep lastUpdateTime; \
dumpsys package ${pkg} | grep minSdk; \
echo APK_PATH=$(pm path ${pkg}); \
echo MAIN_ACTIVITY=$(cmd package resolve-activity --brief ${pkg} | tail -1)"`,

    threads: (pid: string) =>
        `adb shell "top -H -n 1 -p ${pid}"`

};