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
        skin_color
        eye_color
        hair_color
       
      }
    }
  }
`;
export const GET_PEOPLE_DETAIL = gql`
query GET_PEOPLE_DETAIL($personId: Int!) {
  person(id: $personId) {
        id
        name
        gender
        birthYear
        skin_color
        eye_color
        hair_color
        films
        homeworld {
      name
      population
      climate
      terrain
      gravity
      diameter
    }
  }
  
}
`;