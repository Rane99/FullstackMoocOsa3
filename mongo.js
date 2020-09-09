
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)



const password = process.argv[2]

const url = `mongodb+srv://JoonaRantanen:${password}@cluster0.7puan.mongodb.net/<mydb>?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const phoneSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phone = mongoose.model('Phone', phoneSchema)

const phone = new Phone({
  name: process.argv[3],
  number: process.argv[4],
})


if (process.argv.length<4) {
  Phone.find({}).then(result => {
    result.forEach(phone => {
      console.log(phone)
    })
    mongoose.connection.close()
  })
 
}else {

  phone.save().then(response => {
    console.log('added ' + process.argv[3] + ' number ' + process.argv[4] + ' to phonebook')
    mongoose.connection.close()
  })
}



