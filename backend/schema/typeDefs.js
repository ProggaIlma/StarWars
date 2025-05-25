import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Person {
    id: String
    name: String
    gender: String
    birthYear: String
    homeworld: String
    eye_color: String
    hair_color: String
    skin_color: String
    films: [String]
  }

  type PeopleResult {
    results: [Person]
    totalRecords: Int
    totalPages: Int
    currentPage: Int
  }

  type Query {
    people(page: Int, limit: Int, name: String): PeopleResult
    person(id: Int!): Person
  }
`;
