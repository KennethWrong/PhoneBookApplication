const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/mongo.js')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())



//get all persons
app.get('/api/persons',(request,response) => {
    Person.find({}).then(people => {
        response.send(people)
    })
})

//get information
app.get('/info',(request,response) => {
    const length = Person.length
    response.send(`<div> Phonbook has info for ${length} people </div>
    ${Date()}`)
})

//get specirfic person
app.get('/api/persons/:id',(request,response) => {
    let id = request.params.id
    Person.findById(id).then(people => {
        response.send(people)
    })
    .catch(error => {
        console.log(error)
        return (response.status(404).end())
    })
})

//delete function
app.delete('/api/persons/:id',(request,response) => {
    let id = request.params.id
    Person.findById(id).then(people => {
        response.send(people)
    })
    .catch(error => {
        console.log(error)
        return (response.status(404).end())
    })
})

//POST function
app.post('/api/persons',(request,response) => {
    let body = request.body
    let valid = Person.find({name: `${body.name}`})

    if(!body.name || !body.number || !valid){
        if(body.name === undefined){
            return response.status(400).json({
                error: 'Name missing'
            })
        }else if(body.number === undefined){
            return response.status(400).json({
                error: 'Number missing'
            })
        }else{
            return response.status(400).json({
                error: 'Name already exists'
            })
        }
    }
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(people => {
        response.json(people)
    })
})


//Server port listening
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
