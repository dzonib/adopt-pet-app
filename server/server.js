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
const ShelterModel = require('./models/Shelter');

const resolvers = {
  Query: {
    hello: (_, {name}) => `Hello ${name || 'World'}`,
    getAnimals: () => AnimalModel.find(),
    getAnimal: (_, {id}) => AnimalModel.findById(id),
    getShelters:() => ShelterModel.find({})
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
    },
    addShelter: (_, {name, city}) => {
      const shelter = new ShelterModel({
        name,
        city
      });

      return shelter.save()
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './typeDefs.graphql',
  resolvers
});


server.start(() => console.log(`Server is running on http://localhost:4000`))