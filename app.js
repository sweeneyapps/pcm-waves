const spawn = require('child_process').spawn

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/pcm.html')
})

app.get('/download', (req, res) => {
  res.sendFile(__dirname + '/piano.mp3')
});

app.get('/canvas.js', (req, res) => {
  res.sendFile(__dirname + '/canvas.js');
});

app.get('/pcm.js', (req, res) => {

  const filename = "piano.mp3"
  //const filename = "sin_250Hz_0dBFS_10s.wav"
  var output = []

  var ffmpeg = spawn('ffmpeg', 
    ['-i', filename, 
     '-f', 's16le', 
     '-ac', '2', 
     '-acodec', 'pcm_s16le', 
     '-ar', '44100', 
     '-y', 'pipe:1'])

   ffmpeg.stdout.on('data', data => { 
     for (var i = 0; i < data.length; i+=2) {
       output.push(data.readInt16LE(i))
     }          
   })
   ffmpeg.stdout.on('end', function() {
     res.jsonp(output)
   }) 

})

// catch all
app.use((req,res) => { res.redirect('/'); })

app.listen(3000, () => { console.log('web server at port 3000')})
