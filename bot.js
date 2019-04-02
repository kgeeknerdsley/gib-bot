//Gib.bot source by Kevin Worsley

const Discord = require('discord.js'); //discord dependency
const bot = new Discord.Client();

token = require('./auth.json'); //pull in the authorization token

var text = require("./text.json"); //holds various text pieces, insults, help, etc.

//two functions to clean up the token from JSON -> string
var tokenString = JSON.stringify(token);
var finalToken = tokenString.slice(10, (tokenString.length - 2));

//arrays that hold objects like servers, channels, etc.
var theCallUsers = [];
var khcUsers = [];
var channels = [];
var guildList = [];

//iterators for making arrays of objects
var currentChannel = 0;
var currentUserCall = 0;
var currentUserKHC = 0;
var currentGuild = 0;

//lets bot know if a sound is currently playing
var isPlaying = false;

//holds id numbers of connected servers, update if more servers added
var theCallID = '145733398261006336';
var khcID = '483017577602482198';

//Bot setup, this runs before login occurs

bot.on('ready', () => { //event listener that readies up bot
	console.log("Ready to go!");
	console.log("Connecting as " + bot.user.tag + "\n");

	bot.guilds.forEach((guild) => { //list all servers it's connected to
		//console.log(" " + guild.name);
		guildList[currentGuild] = guild.id;
		currentGuild++;


		guild.channels.forEach((channel) => { //list all channels it finds
			//console.log(" Name: " + channel.name + " ID: " + channel.id);
			channels[currentChannel] = channel.id; //assign channel id to the global array
			currentChannel++;
		})

		guild.members.forEach((members) => { //list a guild's members
			//console.log(" Name: " + members.displayName);

			if (guild.id == theCallID) { //sorts users into appropriate lists
				theCallUsers[currentUserCall] = members;
				currentUserCall++;
			} else if (guild.id == khcID) {
				khcUsers[currentUserKHC] = members;
				currentUserKHC++;
			}

		})
	})

	readValues();

});

//Bot functionality underneath here!

bot.on('message', (message) => { //listens for messages
	var msg = new String(message);


	if (message.author == bot.user) { //the bot will read its own message and trigger itself if not caught by this
	} else {
		if (msg.indexOf("!") == 0) { //if the first character of a message is a command trigger

			var commandText = msg.slice(1); //chops off the ! in commands to read the text

			switch (commandText) {
				case "insult":
					insultUser(message);
					break;

				case "help":
					helpText(message);
					break;

				case "meme":
					sendMeme(message);
					break;

				case "spotson":
					spotsOn(message);
					break;

				case "clawsout":
					clawsOut(message);
					break;

				case "cointoss":
					coinToss(message);
					break;

				case "channelTest":
					channelTest(message);
					break;

				default:
					message.channel.send("Command not recognized. Check your spelling dumbass");
					break;
			}
		}
	}


});

bot.login(finalToken); //logs in the bot to discord servers

function helpText(message) { //displays a message showing off all commands capable
	console.log("Received a help command from " + message.guild.name);
	var helpString = "";

	for (var test = 0; test < text.help.length; test++) {
		helpString += text.help[test];
	}
	message.channel.send("Command list:  \n \n" + helpString);
}

function insultUser(message) {
	console.log("Received an insult command from " + message.guild.name); //tell console command received

	var randomInsultCall = Math.floor(Math.random() * text.insults.length); //get a random insult index, used in all server cases

	if (message.guild.id == theCallID) {
		message.channel.send("tactical roast inbound"); //send message to the call

		var randomUserCall = Math.floor(Math.random() * theCallUsers.length); //get a random user index from call users
		var tempUser = theCallUsers[randomUserCall];

		if (!tempUser.user.bot) { //make sure the selected user isn't a bot
			message.channel.send("hey " + tempUser + "," + text.insults[randomInsultCall]); 
		} else { //otherwise...
			message.channel.send("hey " + theCallUsers[randomUserCall-1] + "," + text.insults[randomInsultCall]); //call the user one above the bot
		}
		 //send a message with a random roast targeted to random user
	} else if (message.guild.id == khcID) {
		var randomUserKHC = Math.floor(Math.random() * khcUsers.length); //get a random user index
		var tempUserKHC = khcUsers[randomUserKHC];

		if (!tempUserKHC.user.bot) { //if user not a bot
			message.channel.send("hey " + tempUserKHC + "," + text.insults[randomInsultCall]); //send insult to selected user
		} else { //if user is a bot
			message.channel.send("hey " + khcUsers[randomUserKHC-1] + "," + text.insults[randomInsultCall]); //use the user one above
		}
	} else {
		message.channel.send("Could not determine server. Has this code been updated for your server?"); //if id isn't resolved. shouldn't happen
	}
}

function sendMeme(message) {

}

function playMemeSound(message, type) {
	if (message.member.voiceChannel && !isPlaying) { //if user who sent message is in a voice channel and sound not playing

		var channel = message.member.voiceChannel; //save voice channel as ez variable
		channel.join() //join that channel
			.then(connection => { //create instance of connection
				isPlaying = true;

				var dispatcher;

				if (type == 'ladybug') {
					message.reply("Spots on!!!"); //tell user it's time
					dispatcher = connection.playFile("./resources/spotson.mp3"); //plays ladybug sound
				} else if (type == 'chatnoir') {
					message.reply("Claws out!!!"); //tell user it's time
					dispatcher = connection.playFile("./resources/clawsout.mp3"); //plays chat sound
				}

				dispatcher.on("end", (end) => { //when dispatcher is done, it emits an end signal
					isPlaying = false;
					channel.leave(); //leave the channel when end fires
				})
			})
			.catch(console.log);
	} else if (isPlaying) { //if request arrives while sound playing, don't stop it
		message.channel.send("Let it fucking finish");
	} else if (!message.member.voiceChannel) { //if member isn't in a voice channel
		message.reply("You gotta be in a voice channel so you can hear this hoe");
	}
}

function spotsOn(message) {
	playMemeSound(message, 'ladybug');
}

function clawsOut(message) {
	playMemeSound(message, 'chatnoir');
}

function coinToss(message) {
	var toss = Math.floor(Math.random() * 2); //generates a 0 or 1

	if (toss == 0) {
		message.channel.send("Flipped a coin, got heads");
	} else {
		message.channel.send("Flipped a coin, got tails");
	}
}

function channelTest(message) { //test function for various features
	var guildID = message.guild.id;

	if (guildID == theCallID) {
		console.log("Message from the call!");
	} else if (guildID == khcID) {
		console.log("Message from khc server");
	}

	console.log(currentUser);
	console.log(currentGuild);
	console.log(guildList[0]);
}

function readValues() { //prints various values i want to see, just an internal test function
	console.log(khcUsers[3].user.bot);
}