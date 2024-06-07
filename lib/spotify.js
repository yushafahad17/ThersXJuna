process.env['SPOTIFY_CLIENT_ID'] = '4c4fc8c3496243cbba99b39826e2841f'
process.env['SPOTIFY_CLIENT_SECRET'] = 'd598f89aba0946e2b85fb8aefa9ae4c8'
const axios = require('axios')

convert = ms => {
      var minutes = Math.floor(ms / 60000)
      var seconds = ((ms % 60000) / 1000).toFixed(0)
      return minutes + ':' + (seconds < 10 ? '0' : '') + seconds
   }
   
   spotifyCreds = () => {
      return new Promise(async resolve => {
         try {
            const json = await (await axios.post('https://accounts.spotify.com/api/token', 'grant_type=client_credentials', {
               headers: {
                  Authorization: 'Basic ' + Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')
               }
            })).data
            if (!json.access_token) return resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: 'Can\'t generate token!'
            })
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
   
   getInfo = url => {
      return new Promise(async resolve => {
         try {
            const creds = await spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/tracks/' + url.split('track/')[1], {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data: {
                  thumbnail: json.album.images[0].url,
                  title: json.artists[0].name + ' - ' + json.name,
                  artist: json.artists[0],
                  duration: convert(json.duration_ms),
                  preview: json.preview_url
               }
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
   searching = (query, type = 'track', limit = 20) => {
      return new Promise(async resolve => {
         try {
            const creds = await spotifyCreds()
            if (!creds.status) return resolve(creds)
            const json = await (await axios.get('https://api.spotify.com/v1/search?query=' + query + '&type=' + type + '&offset=0&limit=' + limit, {
               headers: {
                  Authorization: 'Bearer ' + creds.data.access_token
               }
            })).data
            if (!json.tracks.items || json.tracks.items.length < 1) return resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: 'Music not found!'
            })
            let data = []
            json.tracks.items.map(v => data.push({
               title: v.album.artists[0].name + ' - ' + v.name,
               duration: convert(v.duration_ms),
               popularity: v.popularity + '%',
               preview: v.preview_url,
               url: v.external_urls.spotify
            }))
            resolve({
               creator: 'Budy x creator ',
               status: true,
               data
            })
         } catch (e) {
            resolve({
               creator: 'Budy x creator ',
               status: false,
               msg: e.message
            })
         }
      })
   }
   
 module.exports = searching