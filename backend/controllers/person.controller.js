import fetch from 'node-fetch';
import films from '../data/films.js';

const BASE_URL = 'https://www.swapi.tech/api';

const cache = new Map();

const fetchHomeworldFromUrl = async (url) => {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();

    const props = data.result?.properties ?? {};

    const homeworldData = {
      name: props.name || null,
      population: props.population || null,
      climate: props.climate || null,
      terrain: props.terrain || null,
      gravity: props.gravity || null,
      diameter: props.diameter || null,
    };

    cache.set(url, homeworldData);
    return homeworldData;
  } catch {
    return null;
  }
};


const getFilmsForCharacter = async (personId) => {
  try {


    const personUrl = `${BASE_URL}/people/${personId}`;
    
   
    return films
      .filter(film => film.properties?.characters.includes(personUrl))
      .map(film => film.properties.title);
  } catch {
    return [];
  }
};

export const fetchPersonById = async (id) => {
  const url = `${BASE_URL}/people/${id}`;
  if (cache.has(url)) return cache.get(url);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
  const data = await res.json();
  cache.set(url, data);
  return data;
};

export const fetchPeople = async ({ page, limit, name }) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
  if (name) queryParams.append('name', name);

  const url = `${BASE_URL}/people?${queryParams.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
  return res.json();
};

export const getPerson = async (id) => {
  const data = await fetchPersonById(id);

  if (!data?.result?.properties) {
    throw new Error(`Invalid person response for ID: ${id}`);
  }

  const p = data.result.properties;

 const [homeworld, films] = await Promise.all([
  fetchHomeworldFromUrl(p.homeworld),
  getFilmsForCharacter(id)
]);

  return {
    id,
    name: p.name,
    gender: p.gender,
    birthYear: p.birth_year,
    homeworld,
    eye_color: p.eye_color,
    hair_color: p.hair_color,
    skin_color: p.skin_color,
    films
  };
};
export const getPersonforlist = async (id) => {
  const data = await fetchPersonById(id);

  if (!data?.result?.properties) {
    throw new Error(`Invalid person response for ID: ${id}`);
  }

  const p = data.result.properties;

  

  return {
    id,
    name: p.name,
    gender: p.gender,
    birthYear: p.birth_year,
    eye_color: p.eye_color,
    hair_color: p.hair_color,
    skin_color: p.skin_color,
  };
};
export const getPeople = async ({ page = 1, limit = 10, name = '' }) => {
  const data = await fetchPeople({ page, limit, name });

  if (!data || (!data.results && !data.result)) {
    return {
      results: [],
      totalRecords: 0,
      totalPages: 0,
      currentPage: page
    };
  }

  const rawList = data.results || data.result;
console.log(rawList);

  const results = await Promise.all(
    rawList.map(async (item) => {
      try {
        return await getPersonforlist(item.uid);
      } catch (err) {
        console.error(`Failed to fetch full person data for UID ${item.uid}:`, err.message);
        return null;
      }
    })
  );
console.log(results);

  return {
    results: results.filter(Boolean),
    totalRecords: data.total_records ?? results.length,
    totalPages: data.total_pages ?? 1,
    currentPage: page
  };
};
