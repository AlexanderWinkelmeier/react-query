import { useQueries } from 'react-query';
import axios from 'axios';

const fetchSuperHero = (heroId) => {
  return axios.get(`http://localhost:4000/superheroes/${heroId}`);
};

export const DynamicParallelPage = ({ heroIds }) => {
  // Verwendung von useQueries, nicht useQuery!
  // queryResults ist ein Array aus data etc. für jede einzelne id
  const queryResults = useQueries(
    heroIds.map((id) => {
      return {
        queryKey: ['super-hero', id],
        queryFn: () => fetchSuperHero(id),
      };
    })
  );

  console.log({ queryResults });
  return <div>Dynamic Parallel Queries</div>;
};
