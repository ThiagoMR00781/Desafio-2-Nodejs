const express = require('express')
const bodyParser = require('body-parser')
const { cwd } = require('process')
const { join } = require('path')
const { error } = require('console')
const { ifError } = require('assert')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const DB = [{
    id: 1,
    name: 'Thiago Ribas'
},
{   id: 2,
    name: 'Sivio Santos'
},
{   id: 3,
    name: 'Fasto Silva'
},
{   id: 4,
    name: 'Galvão Bueno'
}
]

app.get('/', (req, res) => {
    res.sendFile(join(cwd(), 'index.html'))
})

// crie as outras rotas aqui


app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000!')
})

app.get('/pessoa', (req, res) => {
    return res.json([DB])
})

function buscaID(id){
    return DB.findIndex(DB => DB.id == id)
}
app.get('/pessoa/:id', (req, res) => {
    let id = buscaID(req.params.id)
    res.json(DB[id])
})

app.post('/pessoa', (req, res) => {
    DB.push(req.body)
    res.status(201).send('A pessoa foi cadastrada no DB')
})

app.put('/pessoa/:id', (req, res) => {
    let id = buscaID(req.params.id)
    DB[id].name = req.body.name 
    res.json(DB)
})

app.delete('/pessoa/:id', (req, res) => {
    let {id} = req.params
    let ids = buscaID(id)
    DB.splice(ids, 1)
    res.send('A pessoa com '+ id +' foi deletada do banco')
})