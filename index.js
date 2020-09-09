require('dotenv').config()
const Phone = require('./models/phone')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const { response } = require('express')
const app = express()






morgan.token('content', function getContent (req) {
  return req.content
})

app.use(express.static('build'))
app.use(express.json()) 
app.use(assignContent)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())


function assignContent (req, res, next) {
  req.content = JSON.stringify(req.body)
  next()
} 





app.get('/', (req, res) => {

  res.send('<h1>Hello World</h1>')
})

app.get('/info', (req, res) => {

  Phone.find({}).then(phones => {
    res.send(`<p>Phonebook has info for  ${phones.length} people</p> ${new Date()}`)
  })

  
})



app.get('/api/persons', (req, res,) => {
  Phone.find({}).then(phones => {
    res.json(phones)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Phone.findById(request.params.id).then(phone => {

    if (phone){
      response.json(phone)
    }else{
      response.status(404).end()
    }
    
  }).catch(error => next(error))
})



app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }


  const person = new Phone({
    name: body.name,
    number: body.number
  })

  person.save().then(saved => {
    response.json(saved)
  }).catch( error => next(error))
 
})

app.delete('/api/persons/:id', (request, response, next) => {
  Phone.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Phone.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})