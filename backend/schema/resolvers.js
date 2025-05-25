import { getPeople, getPerson } from '../controllers/person.controller.js';

export const resolvers = {
  Query: {
    people: (_, args) => getPeople(args),
    person: (_, { id }) => getPerson(id)
  }
};
