const {
  GraphQLServer
} = require('graphql-yoga');

const mongoose = require('mongoose');

const db = require('./config/keys').mongoURI;

mongoose.connect(db, {
    useNewUrlParser: true
  })
  .then(console.log('connected to db'))
  .catch((e) => `ERROR! --> ${e}`)

const AnimalModel = require('./models/Animal');

const resolvers = {
  Query: {
    hello: (_, {
      name
    }) => `Hello ${name || 'World'}`,
  },
  Mutation: {
    addAnimal: async (_, {
      name,
      type,
      shelterId,
      age
    }) => {
      const Animal = await new AnimalModel({
        name,
        type,
        shelterId,
        age
      })

      return Animal.save()
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './typeDefs.graphql',
  resolvers
});


server.start(() => console.log(`Server is running on http://localhost:4000`))