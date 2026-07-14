PACKAGE=com.whatsapp

meminfo:
	adb shell "dumpsys meminfo $(PACKAGE) | grep -E 'Native Heap|Java Heap|Graphics|TOTAL'"

procmeminfo:
	adb shell "cat /proc/meminfo"

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

app-info:
	adb shell "echo package=$(PACKAGE); \
	dumpsys package $(PACKAGE) | grep versionName; \
	dumpsys package $(PACKAGE) | grep 'versionCode'; \
	dumpsys package $(PACKAGE) | grep 'firstInstallTime'; \
	dumpsys package $(PACKAGE) | grep 'lastUpdateTime'; \
	dumpsys package $(PACKAGE) | grep 'minSdk'; \
	echo APK_PATH=$$(pm path $(PACKAGE)); \
	echo MAIN_ACTIVITY=$$(cmd package resolve-activity --brief $(PACKAGE) | tail -1)"

# Requer o PID do processo (ver target "pid" acima).
# Uso: make threads PID=1234
threads:
	adb shell "top -H -n 1 -p $(PID)"

#-------- essenciais

generate:
	node scripts/generate.js $(type) $(name)

hook:
	$(MAKE) generate type=hook name=$(name)

service:
	$(MAKE) generate type=service name=$(name)

parser:
	$(MAKE) generate type=parser name=$(name)

component:
	$(MAKE) generate type=component name=$(name)

page:
	$(MAKE) generate type=page name=$(name)