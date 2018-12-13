// server.js
// where your node js app starts

// keep the server running

const http = require('http');
const express = require('express');
const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 240000);
app.use(express.static('public'));

// discord stuff


const compiler = require("./code/Compiler.js");
const timer = require("./code/Timer.js");
const db = require("./code/db.js");
const fh = require("./fileHandler");

fh.read("./data/Status.txt");

let db_on = false;
let db_stuff = ["your fat", "kill yourself", "ugly", "retard", "no one likes you", "fat and ugly"];
const danielId = 200699282989383682;
const rebId = 288880391925006336;
const myId = 445907614480728065;

const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

const channels = ["bot-channel", "code-stuff", "shit-talk"];



client.on("ready", () => {
  console.log("I am ready!");
});
 
client.on("message", (message) => {
  if (message.author.bot) return;
  
  let data = {
    msg: message.content.toLowerCase(),
    user: message.author.username,
    id: message.author.id,
    channel: message.channel.name.toString(),
    mention: "<@" + message.author.id +  ">"
  }
  
  console.log(data.mention);
  
  if (channels.includes(data.channel)) {
    
    if (data.msg === ".start") {
      
      //fs.writeFile("Data.json", JSON.stringify(d), err=>{
      //  console.log("nnnnn");
      //});
      
      timer.start(data, message);
      
      /*
      fs.readFile("Data.json", (err, dat) => {
        if (err) {
          throw err;
        }
        
        let dataFile = JSON.parse(dat);
        dataFile["startTime"][data.id] = new Date().getTime();
        
        fs.writeFile("Data.json", JSON.stringify(dataFile), (err) => {
          if (err) {
            console.log("err 2");
          }
          message.channel.send(data.mention + " time started");
        });
      });
      */
    }
    
    if (data.msg === ".stop") {
      
      timer.stop(data, message);
      
      /*
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
      */
      
    } 
    
    if (data.msg === ".cancel") {
      
      timer.cancel(data, message);
      
      /*
      
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
      
      */
      
    }
    
    if (data.msg === ".times") {
      
      timer.times(data, message, Discord, client);
      
      /*
      
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
            console.log(reversedDict[value]);
            let u = getUsername(message, reversedDict[value]);
            text += "\n" + u + ": " + hours + "h " + minutes + "m " + seconds + "s";
          } else {
            let n = getNickname(message, reversedDict[value]);
            text += "\n" + n + ": " + hours + "h " + minutes + "m " + seconds + "s";
          }
        });
        message.channel.send(text);
      });
      */
    }
    
    if (data.msg === ".ids" && data.id == myId) {
      client.users.forEach(user => {
        if (user instanceof Discord.User) {
          console.log(user.username + " : " + user.id);
        }
      });
    }
  }
  
  // df stuff
  
  if (data.msg.startsWith(".db ") && data.id != danielId && data.id != rebId && data.channel != "general") {
    let inputs = data.msg.split(" ");
    //console.log(inputs);
    if (inputs[1] == "on" || inputs[1] == "off") {
      
      db.toggle(inputs);
      
      /*
      fs.readFile("Data.json", (err, raw) => {
        let data = JSON.parse(raw);
        if (inputs[1] == "on") {
          data["db_on"] = true;
        } else if (inputs[1] == "off") {
          data["db_on"] = false;
        }
        
        fs.writeFile("Data.json", JSON.stringify(data), err => {
          if (err) console.log(err);
        });
      });
      */
    } else if (inputs[1] == "add") {
      
      db.add(inputs, message);
      /*
      fs.readFile("Data.json", (err, raw) => {
        let data = JSON.parse(raw);
        
        let arr = data["db_items"];
        let string = inputs.splice(2).join(" ");
        arr.push(string);
        data["db_items"] = arr;
        
        fs.writeFile("Data.json", JSON.stringify(data), err => {
          if (!err) {
            message.channel.send("\"" + string + "\"" + " -- added");
          }
        });
      });
      */
    } else if (inputs[1] == "remove") {
      
      db.remove(inputs, message);
      /*
      fs.readFile("Data.json", (err, raw) => {
        let data = JSON.parse(raw);
        let string = inputs.splice(2).join(" ");
        console.log(data["db_items"].includes(string));
        if (data["db_items"].includes(string)) {
          data["db_items"] = data["db_items"].filter(e => {
            return e !== string;
          });
          message.channel.send("\"" + string + "\"" + " -- removed");
        }
        fs.writeFile("Data.json", JSON.stringify(data), err => {
          if (err) console.log(err);
        });
      });
      */
    } else if (inputs[1] == "list") {
      
      db.list(message);
      /*
      fs.readFile("Data.json", (err, raw) => {
        if (err) console.log(err);
        let data = JSON.parse(raw);
        let string = "";
        data["db_items"].forEach(value => {
          string += "\n" + value;
        });
        message.channel.send(string);
      });
      */
    } else if (inputs[1] == "status") {
      
      db.status(message);
      /*
      //comp.a();
      fs.readFile("Data.json", (err, raw) => {
        let data = JSON.parse(raw);
        let status = data["db_on"];
        if (status) {
          message.channel.send("db is on");
        } else {
          message.channel.send("db is off");
        }
      });
      */
    } else if (inputs[1] == "time" && inputs[2] == "set" && data.id == myId) {
      
      db.timeSet(inputs, message);
      /*
      if (!isNaN(parseInt(inputs[3]))) {
        db_timer = parseInt(inputs[3]);
        message.channel.send("timer is: " + db_timer);
      }
      */
    }
  }
  
  if (data.id == myId || data.id == rebId && data.channel != "ashquest" && data.channel != "ashquest-maps") {
    
    db.run(data, message);
    /*
    fs.readFile("Data.json", (err, raw) => {
      let data = JSON.parse(raw);
      if (data["db_on"]) {
        
        fs.readFile("Data.json", (err, raw) => {
          let data = JSON.parse(raw);
          let time = data["db_time"];
          if (time == 0) {
            let text = data["db_items"][Math.floor(Math.random() * data["db_items"].length)];
            message.channel.send(data.mention + " " + text);
            data["db_time"] = (new Date()).getTime();
          
          } else if (((new Date().getTime()) - time) >= db.getTime()) {
            let text = data["db_items"][Math.floor(Math.random() * data["db_items"].length)];
            message.channel.send(data.mention + " " + text);
            data["db_time"] = (new Date()).getTime();
          }
          
          fs.writeFile("Data.json", JSON.stringify(data), err => {
            if (err) console.log(err);
          });
        });
      }
    });
    */
  }
});

function getUsername(message, id) {
  let u;
  client.users.forEach(user=>{
    if(user instanceof Discord.User) {
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
 
//client.login(process.env.TESTBOT);
client.login(process.env.BOBBOT);