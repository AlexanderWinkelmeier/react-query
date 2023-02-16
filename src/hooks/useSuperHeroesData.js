import { useQuery, useMutation, useQueryClient } from 'react-query';
import { request } from '../utils/axios-utils';

// ! Fetcher-Funktion für den API-Call
const fetchSuperHeroes = () => {
  // return axios.get('http://localhost:4000/superheroes');
  return request({ url: '/superheroes' });
};

// ! Mutation-Funktion für den API-Call
const addSuperHero = (hero) => {
  // return axios.post('http://localhost:4000/superheroes', hero);
  return request({ url: '/superheroes', method: 'post', data: hero });
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
  // eine Instanz von useQueryClient erstellen
  const queryClient = useQueryClient();
  return useMutation(addSuperHero, {
    // data ist der gesamte Response aus dem POST-Request
    // onSuccess: (data) => {
    //   // die alten Abfrage-Daten die Response aus dem POST-Request anfügen und die Abfrage-Daten
    //   // dadurch aktualisieren
    //   queryClient.setQueryData('super-heroes', (oldQueryData) => {
    //     return {
    //       ...oldQueryData,
    //       data: [...oldQueryData.data, data.data],
    //     };
    //   });
    // },
    /**Optimistic Update Start */
    onMutate: async (newHero) => {
      await queryClient.cancelQueries('super-heroes');
      const previousHeroData = queryClient.getQueryData('super-heroes');
      queryClient.setQueryData('super-heroes', (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [
            ...oldQueryData.data,
            { id: oldQueryData?.data?.length + 1, ...newHero },
          ],
        };
      });
      return { previousHeroData };
    },
    onError: (_err, _newTodo, context) => {
      queryClient.setQueryData('super-heroes', context.previousHeroData);
    },
    onSettled: () => {
      queryClient.invalidateQueries('super-heroes');
    },
    /**Optimistic Update End */
  });
};
