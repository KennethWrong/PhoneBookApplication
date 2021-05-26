const express = require('express')
const app = express()
const cors = require('cors')
const Person = require('./models/mongo.js')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())



//get all persons
app.get('/api/persons',(request,response,next) => {
    Person.find({}).then(people => {
        response.send(people)
    })
    .catch(error => next(error))
})

//get information
app.get('/info',(request,response) => {
    let length = 0
    Person.count({}, function(err,length){
        response.send(`<div> Phonebook has info for ${length} people </div>
    ${Date()}`)
    })
})

//get specirfic person
app.get('/api/persons/:id',(request,response,next) => {
    let id = request.params.id
    Person.findById(id).then(people => {
        response.send(people)
    })
    .catch(error => next(error))
})

//delete function
app.delete('/api/persons/:id',(request,response,next) => {
    let id = request.params.id
    Person.findByIdAndRemove(id).then(people => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

//POST function
app.post('/api/persons',(request,response,next) => {
    let body = request.body

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(people => {
        response.json(people)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id',(request,response,next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person.findByIdAndUpdate(request.params.id,person,{new:true}).then(res => {
        response.send(res)
    })
    .catch(error => next(error))
    
})

const errorHandler = (error, request, response, next) => {
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }
  
    next(error)
  }
  
  app.use(errorHandler)


//Server port listening
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
