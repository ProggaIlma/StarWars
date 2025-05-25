import { gql } from "@apollo/client";

export const GET_PEOPLE = gql`
  query GetPeople($page: Int, $limit: Int, $name: String) {
    people(page: $page, limit: $limit, name: $name) {
      currentPage
      totalPages
      results {
        id
        name
        gender
        birthYear
        homeworld
        skin_color
        eye_color
        hair_color
        films
      }
    }
  }
`;
