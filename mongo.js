const mongoose = require('mongoose')

args = process.argv
arglen = args.length

if (arglen != 3 && arglen != 5){
    console.log('Please provide the following arguments: node mongo.js <password> (name) (number)')
    console.log('the items in (parenthesis) are optional')
    process.exit(1)
}

const password = args[2]

const url = 
    `mongodb+srv://fullstack:${password}@cluster0.nncjy.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useFindAndModify: false, 
        useCreateIndex: true 
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (arglen == 3) {
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person)
        })
        mongoose.connection.close()
    })
} else if (arglen == 5) {
    const person = new Person({
        name: `${args[3]}`,
        number: `${args[4]}`,
    })

    person.save().then(result => {
        console.log(`saved person ${args[3]} with number ${args[4]} to phonebook!`)
        mongoose.connection.close()
    })
}
