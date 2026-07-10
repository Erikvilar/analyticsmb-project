PACKAGE=com.project_mobile

meminfo:
	adb shell "dumpsys meminfo $(PACKAGE) | grep -E 'Native Heap|Java Heap|Graphics|TOTAL'"

gfxinfo:
	adb shell "dumpsys gfxinfo $(PACKAGE) | grep -E 'Total frames rendered|Janky frames|50th percentile|90th percentile|95th percentile|99th percentile'"


cpu:
	adb shell "dumpsys cpuinfo | grep $(PACKAGE) || true"

battery:
	adb shell "dumpsys battery | grep -E 'level|temperature|status|health' || true"

pid:
	adb shell pidof $(PACKAGE)

network:
	adb shell "ss -tun | grep ESTAB || true"

# Requer o PID do processo (ver target "pid" acima).
# Uso: make threads PID=1234
threads:
	adb shell "top -H -n 1 -p $(PID)"
