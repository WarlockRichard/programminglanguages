import re
file = open('access.log', 'r')
group_IP = {}
for line in file.readlines():
	ips = list(re.findall(r'(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}', str))
	for ip in ips:
		mask = '.'.join(ip.split('.')[:-1])
		if mask not in group_IP.keys():
			group_IP[mask] = {}
		group_IP[mask][ip] = 0

for mask, ips in group_IP.items():
	for ip in ips:
		print(ip)