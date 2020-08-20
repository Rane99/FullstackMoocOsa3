
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()





morgan.token('content', function getContent (req) {
  return req.content
})

app.use(express.json()) 
app.use(assignContent)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())

function assignContent (req, res, next) {
  req.content = JSON.stringify(req.body)
  next()
}

let persons = [
  {
    id: 1,
    name: "Joona Rantanen",
    number: "040-123456"
    
  },
  {
    id: 2,
    name: "Ada Lovelance",
    number: "040-2222222"
    
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "040-420000"
    
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "040-999999"
    
  },
]

app.get('/', (req, res) => {

  res.send('<h1>Hello World</h1>')
})

app.get('/info', (req, res) => {

  res.send(`<p>Phonebook has info for  ${persons.length} people</p> ${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(per => per.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})



app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }


  const exists = persons.find(per => per.name === body.name)
  
  if(exists){
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const person = {
    id: Math.floor(Math.random() * 10000000),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})