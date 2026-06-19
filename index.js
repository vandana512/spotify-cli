import chalk from "chalk";
import { trackSelector } from "./src/cli/Print.js"
import { getUrlByName, playSong } from "./src/services/AudioStreamer.js";
import { authorizeSpotify, searchTracks } from "./src/services/Spotify.js"
import inquirer from 'inquirer';


const authorized = await authorizeSpotify()
if(!authorized) {
  console.log("Unable to authorize the user")
  process.exit()
}

console.clear()
console.log("\nWelcome to SpotiCLI, a CLI Based music player!\nFollow the instructions for more!\n\n\n")

while (true) {

    const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'songName',
      message: 'Search by song name:'
    }
  ])
  if(answer.songName.trim() === '') {
    console.log("Please enter a correct song name")
    continue
  }
  
  if(answer.songName.trim().toLowerCase() == 'exit') {
    console.log("Exiting the program...")
    break; 
  }
  
  const res = await searchAndPlay(answer)
  console.log(res)
  if(res === true) {
    console.clear()
  }
  else{
    console.clear()
    continue;
  }
  console.log(chalk.blueBright.bold("The song has ended! Enter the name of another song to continue listening\n"))
}

async function searchAndPlay(answer) {

  console.log('You entered:', answer.songName)

  let searchResult = await searchTracks(answer.songName)
  searchResult = searchResult.body.tracks.items


  const selectedTrack = await trackSelector(searchResult)
  if(selectedTrack === 101) {
    return false;
  }
  const videoUrl = await getUrlByName(selectedTrack.name, selectedTrack.artists[0].name)

  return await playSong(videoUrl)
}