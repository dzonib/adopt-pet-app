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
    getAnimals: () => AnimalModel.find(),
    getAnimal: (_, {id}) => AnimalModel.findById(id),
    getShelters:() => ShelterModel.find({})
  },
  Shelter: {
    animals: (parent, args) => {
      return AnimalModel.find({id: parent.shelterId})
    }
  },
  Animal: {
    shelter: (parent, args) => ShelterModel.findById(parent.ShelteId)
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
    addShelter: async (_, {name, city, zipCode}) => {
      const shelter = await new ShelterModel({
        name,
        city,
        zipCode
      });

      return shelter.save()
    },
    removeAnimal: async (_, {id}) => {
      return AnimalModel.findByIdAndRemove(id)
    },
    editAnimal: async (_, {id, type, age, name, shelterId}) => {
      const animal = await AnimalModel.findById(id)

      const {type:newType, age:newAge, name:newName} = animal;

      const updatedAnimal = {
        ...animal
      }
      console.log(animal)

      await AnimalModel.findByIdAndUpdate(id, {...updatedAnimal})
      return AnimalModel.findById(id)
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './typeDefs.graphql',
  resolvers
});


server.start(() => console.log(`Server is running on http://localhost:4000`))