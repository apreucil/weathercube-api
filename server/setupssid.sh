setupssid()
{
	echo "Searching for local WiFi connection"
	echo "Add a new WiFi network or change the password for an existing one in range"
	echo "For Wifi networks where only a password is required."
	echo "This will not work where a username and password is required"
	echo ""
	echo "If the Pi is currently in Access Point mode with a Autohotspot"
	echo "then use option 6 to Force the Pi to the newly added Wifi Network"
	ct=0; j=0 ; lp=0
	wfselect=()

	until [ $lp -eq 1 ] #wait for wifi if busy, usb wifi is slower.
	do
		IFS=$'\n:$\t' localwifi=($((iw dev wlan0 scan ap-force | egrep "SSID:") 2>&1)) >/dev/null 2>&1
		#if wifi device errors recheck
		if (($j >= 5)); then #if busy 5 times exit to menu
			echo "WiFi Device Unavailable, cannot scan for wifi devices at this time"
			echo "press a key to continue"
			menu
			break
		elif echo "${localwifi[1]}" | grep "No such device (-19)" >/dev/null 2>&1; then
			echo "No Device found,trying again"
			j=$((j + 1))
			sleep 2
		elif echo "${localwifi[1]}" | grep "Network is down (-100)" >/dev/null 2>&1 ; then
			echo "Network Not available, trying again"
			j=$((j + 1))
			sleep 2
		elif echo "${localwifi[1]}" | grep "Read-only file system (-30)" >/dev/null 2>&1 ; then
			echo "Temporary Read only file system, trying again"
			j=$((j + 1))
			sleep 2
		elif echo "${localwifi[1]}" | grep "Invalid exchange (-52)" >/dev/null 2>&1 ; then
			echo "Temporary unavailable, trying again"
			j=$((j + 1))
			sleep 2
		elif echo "${localwifi[1]}" | grep -v "Device or resource busy (-16)"  >/dev/null 2>&1 ; then
			lp=1
		else #see if device not busy in 2 seconds
			echo "WiFi Device unavailable checking again"
			j=$((j + 1))
			sleep 2
		fi
	done

	#Wifi Connections found - continue
	for x in "${localwifi[@]}"
	do
		if [ $x != "SSID" ]; then
			ct=$((ct + 1))
			echo "$ct  ${x/ /}"
			wfselect+=("${x/ /}")
		fi
	done
	ct=$((ct + 1)) 
	echo  "$ct To Cancel"
	wfselect+=("Cancel")
	if [ "${#wfselect[@]}" -eq 1 ] ;then
		echo "Unable to detect local WiFi devices. Maybe there is a temporary issue with your WiFi"
		echo "Try again in a minute"
		echo "press a enter to continue"
		read
		menu
	fi

	read wf
	if [[ $wf =~ ^[0-9]+$ ]]; then
		if [ $wf -ge 0 ] && [ $wf -le $ct ]; then
			updatessid "${wfselect[$wf-1]}"
		else
			echo -e "\nNot a Valid entry"
			setupssid
		fi
	else
		echo -e "\nNot a Valid entry"
		setupssid
	fi
}

setupssid