import { Fragment } from 'react';
import { useInfiniteQuery } from 'react-query';
import axios from 'axios';

// Abruf von der API, hier vom lokalen json-server
const fetchColors = ({ pageParam = 1 }) => {
  return axios.get(`http://localhost:4000/colors?_limit=2&_page=${pageParam}`);
};

export const InfiniteQueriesPage = () => {
  const {
    isLoading,
    isError,
    error,
    data,
    fetchNextPage, // Funktion, die die nächste Seite aufruft und damit neue Daten nachlädt
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(['colors'], fetchColors, {
    // greift auf die fetcher-Funktion, ermittelt die Anzahl der Seiten: ist diese
    // kleiner als 4, so wird diese um eins erhöht, ansonsten undefined zurückgegeben
    // gibt true oder undefined zurück
    // gibt sie true zurück so gibt hasNextPage true zurück ansonsten gibt has NextPage false zurück
    // ist für das Disabling (Nicht-Anzeigen) des Button von Bedeutung (s.u.)
    getNextPageParam: (_lastPage, pages) => {
      if (pages.length < 4) {
        return pages.length + 1;
      } else {
        return undefined;
      }
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <div>
        {/* hier wird nicht über data gemappt, sonder über pages; group ist hier
        die Anzahl an colors, die sich auf der jeweiligen Seite befinden,
        index die sortierte Zahl der jeweiligen Zahl, d.h. die 1. Farbe, die zweite Farbe etc. */}
        {data?.pages.map((group, index) => {
          return (
            <Fragment key={index}>
              {group.data.map((color) => (
                <h2 key={color.id}>
                  {color.id} {color.label}
                </h2>
              ))}
            </Fragment>
          );
        })}
      </div>
      <div>
        {/* Button mit dessen Hilfe Daten nachgeladen werden */}
        <button onClick={() => fetchNextPage()} disabled={!hasNextPage}>
          Load more
        </button>
      </div>
      {/* dient lediglich der Benutzerfreundlichkeit */}
      <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
    </>
  );
};
