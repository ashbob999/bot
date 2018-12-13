const fs = require("fs");
let db_timer = 600000;

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

const toggle = function(inputs) {
   fs.readFile("Data.json", (err, raw) => {
     let dataFile = JSON.parse(raw);
     
     if (inputs[1] == "on") {
       dataFile["db_on"] = true;
     } else if (inputs[1] == "off") {
       dataFile["db_on"] = false;
     }
     
     fs.writeFile("Data.json", JSON.stringify(dataFile), err => {
       if (err) console.log(err);
     });
   });
}

const add = function(inputs, message) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    console.log(dataFile);
    
    let arr = dataFile["db_items"];
    let string = inputs.splice(2).join(" ");
    arr.push(string);
    dataFile["db_items"] = arr;
    
    fs.writeFile("Data.json", JSON.stringify(dataFile), err => {
      if (!err) {
        message.channel.send("\"" + string + "\"" + " -- added");
      }
    });
  });
}

const remove = function(inputs, message) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    let string = inputs.splice(2).join(" ");
    //console.log(data["db_items"].includes(string));
    if (dataFile["db_items"].includes(string)) {
      dataFile["db_items"] = dataFile["db_items"].filter(e => {
        return e !== string;
      });
      message.channel.send("\"" + string + "\"" + " -- removed");
    }
    fs.writeFile("Data.json", JSON.stringify(dataFile), err => {
      if (err) console.log(err);
    });
  });
}

const list = function(message) {
  fs.readFile("Data.json", (err, raw) => {
    if (err) console.log(err);
    
    let dataFile = JSON.parse(raw);
    
    let string = "";
    dataFile["db_items"].forEach(value => {
      string += "\n" + value;
    });
    message.channel.send(string);
  });
}

const status = function(message) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    let status = dataFile["db_on"];
    if (status) {
      message.channel.send("db is on");
    } else {
      message.channel.send("db is off");
    }
  });
}

const timeSet = function(inputs, message) {
  if (!isNaN(parseInt(inputs[3]))) {
    db_timer = parseInt(inputs[3]);
    message.channel.send("timer is: " + db_timer);
  }
}

const run = function(data, message) {
  fs.readFile("Data.json", (err, raw) => {
    let dataFile = JSON.parse(raw);
    if (dataFile["db_on"]) {
      
      let time = dataFile["db_time"];
      if (time == 0) {
        let text = dataFile["db_items"][Math.floor(Math.random() * dataFile["db_items"].length)];
        message.channel.send(data.mention + " " + text);
        dataFile["db_time"] = (new Date()).getTime();
      
      } else if (((new Date().getTime()) - time) >= db_timer) {
        let text = dataFile["db_items"][Math.floor(Math.random() * dataFile["db_items"].length)];
        message.channel.send(data.mention + " " + text);
        dataFile["db_time"] = (new Date()).getTime();
      }
      
      fs.writeFile("Data.json", JSON.stringify(dataFile), err => {
        if (err) console.log(err);
      });
    }
  });
}

module.exports = {
  toggle: toggle.clone(),
  add: add.clone(),
  remove: remove.clone(),
  list: list.clone(),
  status: status.clone(),
  timeSet: timeSet.clone(),
  run: run.clone()
}