import { useQuery, useMutation } from 'react-query';
import axios from 'axios';

// ! Fetcher-Funktion für den API-Call
const fetchSuperHeroes = () => {
  return axios.get('http://localhost:4000/superheroes');
};

// ! Mutation-Funktion für den API-Call
const addSuperHero = (hero) => {
  return axios.post('http://localhost:4000/superheroes', hero);
};

// * Custom Hook für Abfragen
export const useSuperHeroesData = (onSuccess, onError) => {
  return useQuery('super-heroes', fetchSuperHeroes, {
    onSuccess: onSuccess,
    onError: onError,
    // select: (data) => {
    //   // data ist der Response von der API
    //   const superHeroNames = data.data.map((hero) => hero.name);
    //   return superHeroNames;
    // },
  });
};

// * Custom Hook für Mutationen
export const useAddSuperHeroData = () => {
  return useMutation(addSuperHero);
};
