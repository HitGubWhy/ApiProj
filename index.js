const http = require("http")
const path = require("path")
const fs = require("fs")
const url = require("url")
const dataPath = path.join(__dirname, "data")

const server = http.createServer((req, res) => {
    if (req.url == "/jokes" && req.method == "GET") {
        getAllJokes(req, res)
    }

    if (req.url == "/jokes" && req.method == "POST") {
        addJoke(req, res)
    }

    if (req.url.startsWith("/like")) {
        like(req, res)
    }

    if (req.url.startsWith("/dislike")) {
        dislike(req, res)
    }
})

server.listen(3000)

function like(req, res) {
    const params = url.parse(req.url, true).query
    let id = params.id
    console.log(id)
    if (id) {
        let filePath = path.join(dataPath, id + ".json")
        let file = fs.readFileSync(filePath)
        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)
        joke.likes++

        fs.writeFileSync(filePath, JSON.stringify(joke))
        res.end(JSON.stringify({"message": "add"}))
    } else {
        res.end(JSON.stringify({"message": "error add"}))
    }
    
}

function dislike(req, res) {
    const params = url.parse(req.url, true).query
    let id = params.id
    if (id) {
        let filePath = path.join(dataPath, id + ".json")
        let file = fs.readFileSync(filePath)
        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)
        joke.dislikes++

        fs.writeFileSync(filePath, JSON.stringify(joke))
        res.end(JSON.stringify({"message": "dislike added"}))
    } else {
        res.end(JSON.stringify({"message": "error"}))
    }
}


function getAllJokes(req, res) {
    let dir = fs.readdirSync(dataPath)
    let allJokes = [] 

    for (let i = 0; i < dir.length; i++) {
        let file = fs.readFileSync(path.join(dataPath, i + ".json"))
        let jokeJson = Buffer.from(file).toString()
        let joke = JSON.parse(jokeJson)
        joke.id = i
        allJokes.push(joke)
    }
    res.writeHead(200, {"content-type": "application/json"})
    res.end(JSON.stringify(allJokes))
}

function addJoke(req, res) {
    let data = ""

    req.on("data", function(chunk){
        data += chunk
    })

    req.on("end", function(){
        let joke = JSON.parse(data)
        joke.likes = 0
        joke.dislikes = 0

        let dir = fs.readdirSync(dataPath)
        let fileName = dir.length + ".json"
        let filePath = path.join(dataPath, fileName)
        fs.writeFileSync(filePath, JSON.stringify(joke))
        
        res.end()
    })
}














