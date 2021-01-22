require('dotenv').config()
const express = require('express')
const cors = require('cors')

const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
  }
  
app.use(requestLogger)

// landing page
app.get('/', (request, response) => {
  response.send('<h1>Welcome to the phonebook!</h1>')
})

// return full persons list
app.get('/api/persons', (request, response) => {
  Person.find({}).then(person => {
    response.json(person)
  })
})

// return general info
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    const len = persons.length
    response.send(
      `<p>Phonebook has info for ${len} people</p>` + 
      `<p>${new Date()}</p>`
    )
  })
})

// return data for specific user based on ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// deleting one person from book
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      respond.status(204).end()
    })
    .catch(error => next(error))
})

// function for generating random new Id
const generateId = () => {
  return Math.floor(Math.random() * Math.floor(1000))
}

// adding new names to phone book with random phone number
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'body of request missing name or number'
    })
  }

  if (persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())) {
    return response.status(400).json({
      error: `'${body.name}' already in book`
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}
  
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})