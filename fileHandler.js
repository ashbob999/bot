Function.prototype.clone = function() {
	let that = this;
	let temp = function temporary() {
		return that.apply(this, arguments);
	};
	for(let key in this) {
		if (this.hasOwnProperty(key)) {
			temp[key] = this[key];
		}
	} return temp;
};

const fs = require("fs");

const read = function(path) {
  var options = {encoding: 'utf-8', flag: 'r'};
  
  fs.readFile(path, options, function (err, data) {
    
    if(err) {
      console.error(err);
    } else {
      console.log("File content :");
      console.log(data);
      console.log(data);
    }
  });
}

const write = function(path, data) {
  
}

/*

var txtFile = "c:/test.txt";
var file = new File(txtFile);
var str = "My string of text";

file.open("w"); // open file with write access
file.writeln("First line of text");
file.writeln("Second line of text " + str);
file.write(str);
file.close();

/// read from file

var txtFile = "c:/test.txt"
var file = new File(txtFile);

file.open("r"); // open file with read access
var str = "";
while (!file.eof) {
	// read each line of text
	str += file.readln() + "\n";
}
file.close();
alert(str);

*/

module.exports = {
  read: read.clone(),
  write: write.clone()
}