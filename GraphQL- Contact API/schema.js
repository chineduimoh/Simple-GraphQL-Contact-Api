const axios = require("axios");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

// Contact Type
const ContactType = new GraphQLObjectType({
  name: "Contact",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt },
    phone:{ type: GraphQLString },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    contact: {
      type: ContactType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios
          .get("http://localhost:3000/contacts/" + args.id)
          .then(res => res.data);
      },
    },
    contacts: {
      type: new GraphQLList(ContactType),
      resolve(parentValue, args) {
        return axios.get("http://localhost:3000/contacts")
            .then(res => res.data);
      },
    },
  },
});

// Contact Mutations
const mutation = new GraphQLObjectType({
    name:'Mutation',
    fields:{
        addContact:{
            type:ContactType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/contacts', {
                    name:args.name,
                    email: args.email,
                    age:args.age
                })
                .then(res => res.data);
            }
        },
        deleteContact:{
            type:ContactType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/contacts/'+args.id)
                .then(res => res.data);
            }
        },
        editContact:{
            type:ContactType,
            args:{
                id:{type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/customers/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});