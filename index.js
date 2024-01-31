const express = require('express')
const bodyParser = require('body-parser')
const { cwd, constrainedMemory } = require('process')
const { join } = require('path')
const { error } = require('console')
const { ifError, notStrictEqual } = require('assert')

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
    return res.json(DB)
})

function buscaID(id){
    return DB.findIndex(DB => DB.id == id)
}

app.get('/pessoa/:id', (req, res) => {
    let id = buscaID(req.params.id)
    if (id == -1) {
        res.status(404).json({error: "ID não encontrado"})
    } else {
        res.status(201).json(DB[id])
    }
})

function geradorID(length){
    const buffer = crypto.randomBytes(length)
    const numberId = buffer.toString('hex')
    return parseInt(numberId, 16)
}

//let body = DB.push(req.body)
 //   res.send('A pessoa foi cadastrada no DB').json(pessoa)
app.post('/pessoa', (req, res) => {
   let {id, name} = req.body

   let existepessoa = DB.find((pessoa) => pessoa.id == id)

   if(existepessoa){
    return res.status(400).json({ message: 'Pessoa já foi cadastrada'})
   }
   
   if(!id){
    const randomId = geradorID(8)
    req.body.id = randomId
   }

   const novapessoa = { id: req.body.id, name: req.body.name}
   DB.push(novapessoa)

   res.status(201).json({ massage: 'Nova pessoa registrada com sucesso', pessoa: novapessoa})
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