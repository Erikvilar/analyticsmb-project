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
        `adb shell "top -H -n 1 -p ${pid}"`,
    // ---------- STORAGE / DISCO ----------
    storageUsage: (pkg: string) =>
        `adb shell "dumpsys diskstats | grep -A 5 '${pkg}'" || echo "not found"`,

    appDataSize: (pkg: string) =>
        `adb shell "du -sh /data/data/${pkg} 2>/dev/null || echo 'permission denied'"`,

    externalStorage: () =>
        `adb shell "df -h /storage/emulated/0"`,

    // ---------- ATIVIDADE / FOREGROUND ----------
    currentActivity: () =>
        `adb shell "dumpsys activity activities | grep mResumedActivity"`,

    focusedWindow: () =>
        `adb shell "dumpsys window | grep mCurrentFocus"`,

    appUptime: (pkg: string) =>
        `adb shell "dumpsys activity processes | grep -A 3 '${pkg}'"`,

    // ---------- CRASH / ANR ----------
    lastCrash: (pkg: string) =>
        `adb shell "logcat -d -b crash | grep -A 20 '${pkg}' | tail -50"`,

    anrTraces: () =>
        `adb shell "cat /data/anr/traces.txt 2>/dev/null || echo 'no anr file'"`,

    fatalExceptions: (pkg: string) =>
        `adb shell "logcat -d *:E | grep '${pkg}' | tail -50"`,

    // ---------- THREADS / PROCESSO ----------
    threadCount: (pid: string) =>
        `adb shell "ls /proc/${pid}/task | wc -l"`,

    fileDescriptors: (pid: string) =>
        `adb shell "ls /proc/${pid}/fd | wc -l"`,

    nativeHeapDetailed: (pkg: string) =>
        `adb shell "dumpsys meminfo ${pkg} -d"`,

    // ---------- GPU / RENDER ----------
    gpuRenderMode: () =>
        `adb shell "getprop debug.hwui.renderer"`,

    refreshRate: () =>
        `adb shell "dumpsys display | grep -E 'refreshRate|fps'"`,

    overdraw: (pkg: string) =>
        `adb shell "dumpsys gfxinfo ${pkg} framestats"`,

    // ---------- REDE (complementa o network que já tem) ----------
    dnsResolution: () =>
        `adb shell "getprop net.dns1; getprop net.dns2"`,

    wifiInfo: () =>
        `adb shell "dumpsys wifi | grep -E 'mNetworkInfo|SSID|Link speed'"`,

    dataUsage: (pkg: string) =>
        `adb shell "dumpsys netstats detail | grep -A 5 '${pkg}'" || echo "not found"`,

    // ---------- BATERIA / TÉRMICO ----------
    thermalState: () =>
        `adb shell "dumpsys thermalservice | grep -E 'mStatus|Temperature'"`,

    batteryHistory: () =>
        `adb shell "dumpsys batterystats --charged | head -50"`,

    isBatteryOptimized: (pkg: string) =>
        `adb shell "dumpsys deviceidle whitelist | grep ${pkg} || echo 'not whitelisted'"`,

    // ---------- PERMISSÕES ----------
    permissions: (pkg: string) =>
        `adb shell "dumpsys package ${pkg} | grep -A 30 'runtime permissions'"`,

    // ---------- CONTROLE DO APP ----------
    forceStop: (pkg: string) =>
        `adb shell am force-stop ${pkg}`,

    clearAppData: (pkg: string) =>
        `adb shell pm clear ${pkg}`,

    restartApp: (pkg: string) =>
        `adb shell "am force-stop ${pkg} && monkey -p ${pkg} -c android.intent.category.LAUNCHER 1"`,

    grantPermission: (pkg: string, permission: string) =>
        `adb shell pm grant ${pkg} ${permission}`,

    // ---------- SCREEN / DEBUG VISUAL ----------
    screenshot: () =>
        `adb exec-out screencap -p`, // retorna bytes PNG direto, tratar como binário no controller

    screenDensity: () =>
        `adb shell "wm density; wm size"`,

    layoutHierarchy: () =>
        `adb shell "uiautomator dump /sdcard/window_dump.xml && cat /sdcard/window_dump.xml"`,

    // ---------- REALM (achado no fluxo anterior) ----------
    findRealmFiles: (pkg: string) =>
        `adb shell "run-as ${pkg} find /data/data/${pkg} -name '*.realm' -not -name '*.lock'"`,

    // ---------- SISTEMA / DEVICE ----------
    deviceInfo: () =>
        `adb shell "getprop ro.product.model; getprop ro.build.version.release; getprop ro.build.version.sdk"`,

    uptime: () =>
        `adb shell "uptime"`,

    installedPackagesCount: () =>
        `adb shell "pm list packages | wc -l"`,

};