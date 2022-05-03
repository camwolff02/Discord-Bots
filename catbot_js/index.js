//import packages
const fs = require('fs');
const Discord = require('discord.js');

const bot = new Discord.Client();
const picsFolder = './catPics/';
const noteFolder = './notes/';
const notebreaker = '/%/';

var currentMessage = {};
var previousMessage = {};
var catPics = [];
var purrLevel = 0;
var users = [];
var userIndex = 0;
//nodemon --inspect index.js

//bootup
bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    bot.user.setPresence({
        game: { 
            name: 'https://www.youtube.com/watch?v=QSjsLYcbGFY',
            type: 'WATCHING'
        },
        status: 'ready'
    });

    //read all files in pics folder and adds all file names to an array
    fs.readdir(picsFolder, (err, files) => {
        files.forEach(file => {
            catPics.push(file);
        });
    });

    //read all files in notes folder and adds all txt file contents to an array
    fs.readdir(noteFolder, (err, files) => {
        files.forEach(file => {
            fs.readFile(noteFolder + file, "utf8", function(err, data) {
                users.push(txtToUser(data));
                console.log(txtToUser(data));
            });
        });
    });
});

bot.on('message', msg => {
    //msg.channel.send("https://www.youtube.com/watch?v=QSjsLYcbGFY");
    
    previousMessage = currentMessage;
    currentMessage = msg;

    //adds users to a directory of who has sent messages
    var newUser = true;
    var user;

    for(var i = 0; i < users.length; i++) {
        user = users[i];
        if(msg.author == user.username) {
            newUser = false;
            userIndex = i;
        }
    }
    if(newUser) {
        users.push({username: msg.author, notes: []});
        userIndex = users.length-1;
        console.log("Hello New User " + msg.author.username + "!");
    } 

    if(msg.content.startsWith('%')) {
        if(msg.content == '%UwUtron help' || msg.content == '%help') {
            msg.channel.send("list of commands:"+
                            "\n%cat please - UwUtron sends a random picture of a cat" +
                            "\n%thank you UwUtron, very cool - thank UwUtron for his hard work" +
                            "\n%pet - stroke him" +
                            "\n%happiness - ask how UwUtron's doing with life" +
                            "\n%note <message> - stores your message as a note for the *future*" +
                            "\n%note^ - stores the previous message as a note for the *future*" +
                            "\n%notes - allows you to see all your messages, like a *boss*" +
                            "\n%delete @ <index> - delete a note at a given index between 0 and F (sad)" +
                            "\n%clear notes - you're smart enough to figure this one out" +
                            "\n%hexhelp - for people who don't understand what 'between 0 and F' means");
        }

        else if (msg.content === '%cat please' || msg.content === '%Cat please') {
            msg.channel.send('will this do?', {files: ["catPics/" + catPics[getRandomInt(catPics.length)]]});  
        }

        else if(msg.content === '%thank you UwUtron, very cool' || msg.content ==='%pet' || msg.content ==='%Pet') {
            if(getRandomInt(101) != 0) {
                msg.channel.send('*purring intensifies*');
                purrLevel++;
            } else {
                msg.channel.send('no');
                purrLevel = 0;
            }
        }

        else if(msg.content === '%happiness') {
            msg.channel.send("my happiness is currently at " + purrLevel);
        }

        else if(msg.content == '%server.start') {
            
        }

        //adds a new note to the user's notepad
        else if(msg.content.startsWith("%note ") || msg.content == "%note^") {
            if(users[userIndex].notes.length < 16) {       
                if(msg.content == "%note^") {
                    var newNote = previousMessage.content;
                } else {
                    var newNote = msg.content;
                    newNote = newNote.slice(6,newNote.length);
                }
                users[userIndex].notes.push(newNote);
                msg.channel.send('Message successfuly saved!');
            } else {
                msg.channel.send("[ERROR] notepad full" );
            }
        }

        else if(msg.content == "%notes") {
            if(users[userIndex].notes.length != 0) {
                var noteList = "here are your notes:";

                users[userIndex].notes.forEach(note => {
                    noteList += "\n-" + note;
                });
                msg.channel.send(noteList);

            } else {
                msg.channel.send("no notes saved");
            }
        }

        //deletes a note at a given index
        else if(msg.content.startsWith("%delete @")) {
            var deleteIndex = hexToDec(msg.content.charAt(10));
            msg.channel.send(deleteIndex);
            if(deleteIndex < users[userIndex].notes.length) {
                users[userIndex].notes.splice(deleteIndex, 1);
                msg.channel.send("Note @ index " + deleteIndex + " successfully removed");
            } else {
                msg.channel.send("[ERROR] index invalid");
            }
        }

        else if(msg.content == "%clear notes") {
            users[userIndex].notes = [];
            msg.channel.send("notes cleared");
        }

        else if(msg.content == '%hexhelp') {
            msg.channel.send("The hexadecimal number system is a number system that goes from 0 to F, where A is 10, B is 11, C is 12, D is 13, E is 14, F is 15");
        }

        else if(msg.content == '%save notes') {
            msg.channel.send("notes saved")
        }
    }
 });

bot.login('NTgzNDUwMDEwNTU4MDA1MjY3.XPAWFw.t-u78TK-wXcl5wwjXA-h2_Qi0SY');

/*/writes a new text file
fs.writeFile("temp.txt", data, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("successfully written to file");
    }
});*/

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function hexToDec(num) {
    if(isNaN(num)) {
        if(num == "A") {
            return 10;
        } else if(num == "B") {
            return 11;
        } else if(num == "C") {
            return 12;
        } else if(num == "D") {
            return 13;
        } else if(num == "E") {
            return 14;
        } else if(num == "F") {
            return 15;
        }
    }
    return num;
}

//converts a text into the user object given text in format <username/%/note1/%/note2/%/...>
function txtToUser(txt) {
    var tempUsername = "";
    var tempNote = "";
    var checkNotebreaker = "";
    var searching = true;
    var index = 0;
    var tempUser = {username: "", notes: []};

    do { //finds the username of a file
        checkNotebreaker += txt.charAt(index);
        tempUsername += txt.charAt(index);

        //makes sure the notebreaker checker always stays the same length as the actual notebreaker
        if(checkNotebreaker.length > notebreaker.length) {
            checkNotebreaker = checkNotebreaker.substr(1);
        }

        //if you found a signal showing a break in text (you found the username)
        if(checkNotebreaker == notebreaker) {
            searching = false;
            //removes the notebreaker tab from the username
            tempUsername = tempUsername.substring(0, tempUsername.length-notebreaker.length);
        }
        index++;
    } while(searching);

    tempUser.username = tempUsername;

    //loops through txt, finds all instances of notebreaker
    for(var i = index; i < txt.length; i++) {
        checkNotebreaker += txt.charAt(i);
        tempNote += txt.charAt(i);

        if(checkNotebreaker.length > notebreaker.length) {
            checkNotebreaker = checkNotebreaker.substr(1);
        } 

        if(checkNotebreaker == notebreaker) {
            tempUser.notes.push(tempNote.substring(0, tempNote.length-notebreaker.length));
            tempNote = "";
        }
    }
    return(tempUser);
}

function userToTxt(user) { //creates a string based on an object given as {username: user, notes: []}
    var temptxt = user.username + notebreaker;

    for(var i = 0; i < user.notes.length; i++) {
        temptxt += user.notes[i] + notebreaker;
    }
    
    console.log(temptxt);
}

/*NEXT TO PROGRAM:
1. enable opening of minecraft server batch file by command
2. create save feature that permanently saves files as .txt (save username and messages on same text file, write algorithm to break it up)
3. allow for longer lists
4. allow for privatizing vc. publicizing messages
5. add message categories
6. Pokemon TCG Features
7. coin flipper
8. continuously run
9. start on computer boot up




*/