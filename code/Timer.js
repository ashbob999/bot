const fs = require("fs");

Function.prototype.clone = function() {
	var that = this;
	var temp = function temporary() {
		return that.apply(this, arguments);
	};
	for(var key in this) {
		if (this.hasOwnProperty(key)) {
			temp[key] = this[key];
		}
	} return temp;
};

const start = function(data, message) {
  fs.readFile("Data.json", (err, dat) => {
    if (err) {
      throw err;
    }
    
    let dataFile = JSON.parse(dat);
    dataFile["startTime"][data.id] = new Date().getTime();
    
    fs.writeFile("Data.json", JSON.stringify(dataFile), (err) => {
      if (err) {
        console.log(err);
      }
      message.channel.send(data.mention + " time started");
    });
  });
}

const stop = function(data, message) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    
    if (data.id in dataFile["startTime"]) {
      if (dataFile["startTime"][data.id] > 0) { 
        let time = (new Date().getTime()) - dataFile["startTime"][data.id];
        if (time <= 1200000) {
          if (data.id in dataFile["totalTime"]) {
            dataFile["totalTime"][data.id] += time;
          } else {
            dataFile["totalTime"][data.id] = time;
          }
          delete dataFile["startTime"][data.id];
          
          fs.writeFile("Data.json", JSON.stringify(dataFile), (err) => {
            if (err) {
              console.log(err);
            } else {
              message.channel.send(data.mention + " took " + Math.round(time/1000) + "s");
            }
          });
        }
      }
    }
  });
}

const cancel = function(data, message) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    
    delete dataFile["startTime"][data.id];
    
    fs.writeFile("Data.json", JSON.stringify(dataFile), (err) => {
      if (err) {
        console.log(err);
      } else {
        message.channel.send(data.mention + " time cancelled");
      }
    });
  });
}

const times = function(data, message, discord, client) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    
    let text = "times:";
    
    let values = Object.keys(dataFile["totalTime"]).map(key => {
      return dataFile["totalTime"][key];
    });
    
    values.sort((a, b) => {
      return b-a;
    });
    
    let reversedDict = {};
    
    Object.keys(dataFile["totalTime"]).map(key => {
      reversedDict[parseInt(dataFile["totalTime"][key], 10)] = key;
    });
    
    values.forEach(value => {
      let time = Math.round(value / 1000);
      
      let hours = Math.floor(time / 3600); time = time - hours * 3600;
      let minutes = Math.floor(time / 60);
      let seconds = time - minutes * 60;
      
      if (getNickname(message, reversedDict[value]) == null) {
        //console.log(reversedDict[value]);
        let u = getUsername(message, reversedDict[value], client, discord);
        text += "\n" + u + ": " + hours + "h " + minutes + "m " + seconds + "s";
      } else {
        let n = getNickname(message, reversedDict[value]);
        text += "\n" + n + ": " + hours + "h " + minutes + "m " + seconds + "s";
      }
    });
    message.channel.send(text);
  });
}

function getUsername(message, id, client, discord) {
  let u;
  client.users.forEach(user=>{
    if(user instanceof discord.User) {
      if (user.id == id) {
        u = user.username;
      }
    }
  });
  return u;
}

function getNickname(message, id) {
  if (message.guild.members.get(id)== undefined){
    return undefined;
  } else {
    return message.guild.members.get(id).nickname;
  }
}

module.exports = {
  start: start.clone(),
  stop: stop.clone(),
  cancel: cancel.clone(),
  times: times.clone()
}