"use strict"
const fs = require('fs')
fs.readFile('access.log', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
	let group_IP = {};
	const ipRegExp = new RegExp('(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}', 'g');
	let ip;
	while(ip = ipRegExp.exec(data)){
	  let splittedIp = ip['0'].split('.');
		let last = splittedIp.pop();
		const mask = splittedIp.join('.');
		if (!(mask in group_IP)){
			group_IP[mask]=[];
		}
		if(group_IP[mask].indexOf(ip['0'])==-1){
			group_IP[mask].push(ip['0']);
		}
	}
	let mask = [];
	for(mask in group_IP){
		for(ip in group_IP[mask])
			console.log(group_IP[mask][ip]);
	}	
});
