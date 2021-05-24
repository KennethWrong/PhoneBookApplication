const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :pi'))

let persons = [
      {
        "name": "Arto Hellas", 
        "number": "040-123456",
        "id": 1
      },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": 2
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": 3
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": 4
      }
]

//default
app.get('/',(request,response) => {
    response.send("<h1> Sucessfully Reached </h1>")
    
})
//get all persons
app.get('/api/persons',(request,response) => {
    response.json(persons)
})
//get information
app.get('/info',(request,response) => {
    response.send(`<div> Phonbook has info for ${persons.length} people </div>
    ${Date()}`)
})
//get specirfic person
app.get('/api/persons/:id',(request,response) => {
    let id = Number(request.params.id)
    let person = persons.find(n => n.id === id)
    console.log(person)
    if(person){
        response.json(person)
    }else{
        return (response.status(404).end())
    }
})
//delete function
app.delete('/api/persons/:id',(request,response) => {
    let id = Number(request.params.id)
    let person = persons.filter(n=> n.id === id)
    if(person.length > 0){
    persons = persons.filter(n => n.id !== id)
    response.json(person)
    }else{
        return(response.status(404).end())
    }

})

//POST function
app.post('/api/persons',(request,response) => {
    let id = parseInt((1000000000*Math.random()))
    let body = request.body

    let valid = persons.find(person => person.name === body.name)

    if(!body.name || !body.number || valid){
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
    

    const person = {
        id:id,
        name: body.name,
        number: body.number,
    }

    // morgan.token('pi',(request,response) => {
    //     request.pi =JSON.stringify(person)
    //     return request.pi
    // })

    response.json(person)
})


//Server port listening
const PORT = 3000
app.listen(PORT)
console.log(`Server running on port ${PORT}`)