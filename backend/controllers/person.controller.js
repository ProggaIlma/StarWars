import fetch from 'node-fetch';

const BASE_URL = 'https://www.swapi.tech/api';

const fetchNameFromUrl = async (url) => {
  if (!url) return null;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    return data.result.properties.name || data.result.properties.title || null;
  } catch {
    return null;
  }
};

const getFilmsForCharacter = async (personId) => {
  try {
    const res = await fetch(`${BASE_URL}/films`);
    const data = await res.json();

    const allFilms = data.result;
let films = [];
    const personUrl = `${BASE_URL}/people/${personId}`;

    allFilms
      .filter(film => film.properties?.characters.includes(personUrl))
      .map(film =>{ 
        
        films.push(film.properties?.title)});

return films;
  } catch {
    return [];
  }
};

export const fetchPersonById = async (id) => {
  const res = await fetch(`${BASE_URL}/people/${id}`);
  if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
  return res.json();
};

export const fetchPeople = async ({ page, limit,name }) => {
  const queryParams = new URLSearchParams();
  if (page) queryParams.append('page', page);
  if (limit) queryParams.append('limit', limit);
if (name) queryParams.append('name', name);
  const url = `${BASE_URL}/people?${queryParams.toString()}`;
  console.log(url);
  
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

  return {
    id,
    name: p.name,
    gender: p.gender,
    birthYear: p.birth_year,
    homeworld: await fetchNameFromUrl(p.homeworld),
    eye_color: p.eye_color,
    hair_color: p.hair_color,
    skin_color: p.skin_color,
    films: await getFilmsForCharacter(id),
  };
};

export const getPeople = async ({ page = 1, limit = 10,name = '' }) => {
  const data = await fetchPeople({ page, limit,name });

  if (!data || (!data.results && !data.result)) {
    return {
      results: [],
      totalRecords: 0,
      totalPages: 0,
      currentPage: page
    };
  }

  const rawList = data.results || data.result;

  const results = await Promise.all(
    rawList.map(async (item) => {
      try {
        return await getPerson(item.uid);
      } catch (err) {
        console.error(`Failed to fetch full person data for UID ${item.uid}:`, err.message);
        return null;
      }
    })
  );

  return {
    results: results.filter(Boolean),
    totalRecords: data.total_records ?? results.length,
    totalPages: data.total_pages ?? 1,
    currentPage: page
  };
};
