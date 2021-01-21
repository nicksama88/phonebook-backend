const express = require('express')
const cors = require('cors')
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
  
const unknownEndpoint = (request, response) => {
response.status(404).send({ error: 'unknown endpoint' })
}
  
app.use(requestLogger)

let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

// landing page
app.get('/', (request, response) => {
    response.send('<h1>Welcome to the phonebook!</h1>')
})

// return full persons list
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

// return general info
app.get('/info', (request, response) => {
    const len = persons.length
    response.send(
        `<p>Phonebook has info for ${len} people</p>` + 
        `<p>${new Date()}</p>`
    )
})

// return data for specific user based on ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

// deleting one person from book
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

// function for generating random new Id
const generateId = () => {
    // const largestId = persons.length > 0
    //     ? Math.max(...persons.map(n => n.id))
    //     : 0
    // return largestId + 1
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

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)

    response.json(newPerson)
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})