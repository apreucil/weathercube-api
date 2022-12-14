forceswitch()
{
if [ ! -f "/etc/systemd/system/autohotspot.service" ] ;then
	echo "No Autohotspot script installed, unable to continue"
	echo "press enter to continue"
	read
	menu
fi
#Create Hotspot or connect to valid wifi networks
echo 0 > /proc/sys/net/ipv4/ip_forward #deactivate ip forwarding

if systemctl status hostapd | grep "(running)" >/dev/null 2>&1
then
    echo "The access point is already active"
    echo "Switching to Network Wifi if it is available"
    echo "this takes about 20 seconds to complete checks"
	systemctl restart autohotspot.service
	menu
elif { wpa_cli status | grep "$wifidev"; } >/dev/null 2>&1
then
	echo "Cleaning wifi files and Activating Hotspot"
	wpa_cli terminate >/dev/null 2>&1
	ip addr flush "$wifidev"
	ip link set dev "$wifidev" down
	rm -r /var/run/wpa_supplicant >/dev/null 2>&1
	get_HS_IP
    else #Neither the Hotspot or Network is active
	get_HS_IP
fi
}

forceswitch