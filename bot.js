//Gib.bot source by Kevin Worsley
//did github add this?
//see this github?

const Discord = require('discord.js'); //discord dependency
const bot = new Discord.Client();

token = require('./auth.json'); //pull in the authorization token

//two functions to clean up the token from JSON -> string
var tokenString = JSON.stringify(token);
var finalToken = tokenString.slice(10, (tokenString.length - 2));

var users = [];
var currentChannel = 0;
var currentUser = 0;
var channels = []; //array to hold channel ids when they're discovered, until i find a better way

var insults = [" your mother is a hamster and your father smelt of elderberries",
	" your penis size is under the national average",
	" try not to think, you're gonna sprain your brain",
	" do you have to practice to be that ugly?",
	" you smell like you used dog shit as deodorant this morning",
	" my phone battery lasted longer than your last relationship",
	" you're a poopface who's up to no good",
	" your toes are mismatched in length"];

//Bot setup, this runs before login occurs

bot.on('ready', () => { //event listener that readies up bot
	console.log("Ready to go!");
	console.log("Connecting as " + bot.user.tag + "\n" + "\n");
	console.log("Servers I'm a part of: ");
	
	bot.guilds.forEach((guild) => { //list all servers it's connected to
		console.log(" " + guild.name);

		guild.channels.forEach((channel) => { //list all channels it finds
			console.log(" Name: " + channel.name + " ID: " + channel.id);
			channels[currentChannel] = channel.id; //assign channel id to the global array
			currentChannel++;
		})

		guild.members.forEach((members) => { //list a guild's members
			console.log(" Name: " + members.displayName);
			users[currentUser] = members;
			currentUser++;
		})
	})

});

//Bot functionality underneath here!

bot.on('message', (message) => { //listens for messages
	var text = new String(message);

	if (text.indexOf("!") == 0) {

		var commandText = text.slice(1); //chops off the ! in commands to read the text

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

			default:
				message.channel.send("Command not recognized. Check your spelling dumbass");
				break;
		}
	}
});

bot.login(finalToken); //logs in the bot to discord servers

function helpText(message) { //displays a message showing off all commands capable
	console.log("Received a help command.");
	message.channel.send("Current command list: \n \n !insult: insults a random user \n !spotson: Tikki, spots on!");
}

function insultUser(message) {
	console.log("Received an insult command"); //tell console command received

	message.channel.send("tactical roast inbound"); //send message to the channel the command originated from

	var randomUser = Math.floor(Math.random() * users.length); //get a random user index
	var randomInsult = Math.floor(Math.random() * insults.length); //get a random insult index

	message.channel.send("hey " + users[randomUser] + "," + insults[randomInsult]); //send a message with a random roast targeted to random user
}

function sendMeme(message) {

}

function spotsOn(message) {
	if (message.member.voiceChannel) { //if user who sent message is in a voice channel...

		var channel = message.member.voiceChannel; //save voice channel as ez variable
		channel.join() //join that channel
			.then(connection => { //create instance of connection
				message.reply("spots on!!!"); //tell user it's time
				const dispatcher = connection.playFile("C:/Users/Kevin/Desktop/Gibbobot/resources/spotson.mp3"); //plays the audio file specified

				dispatcher.on("end", (end) => { //when dispatcher is done, it emits an end signal
					channel.leave(); //leave the channel when end fires
				})
			})
			.catch(console.log);
	} else {
		message.reply("You gotta be in a voice channel so you can hear this hoe");
	}
}