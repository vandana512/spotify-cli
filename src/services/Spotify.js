import SpotifyWebApi from 'spotify-web-api-node'
import dotenv from 'dotenv'
dotenv.config()

// const spotifyAPI = 'https://accounts.spotify.com/api/token'

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
})

export async function authorizeSpotify() {
    try {

        const data = await spotifyAPI.clientCredentialsGrant()
        spotifyAPI.setAccessToken(data.body['access_token'])
        console.log("User autenticated ")
        return true
    } catch (err) {
        console.error("Failed to authenticate: ", err.message)
        return false
    }
}

export async function searchTracks(query) {
    try {
        const result = await spotifyAPI.searchTracks(query, {limit: 5})
        return result
    } catch (error) {
        console.log("Error in fetching tracks ", error)
        return error
    }
}