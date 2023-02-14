import { useQuery } from 'react-query';
import axios from 'axios';

// ! API-Call zu users/:email
// * 2)
const fetchUserByEmail = (email) => {
  return axios.get(`http://localhost:4000/users/${email}`);
};

// ! API-Call zu channels/:channelId
// * 6)
const fetchCoursesByChannelId = (channelId) => {
  return axios.get(`http://localhost:4000/channels/${channelId}`);
};

// email ist die Property, die dieser Komponente (DependenQueriesPage) übergeben wurde
// * 1)
export const DependentQueriesPage = ({ email }) => {
  // * 3)
  const { data: user } = useQuery(['user', email], () =>
    fetchUserByEmail(email)
  );
  // * 4)
  const channelId = user?.data?.channelId; // hier: codevolution (siehe db.json)
  // * 5)
  useQuery(['courses', channelId], () => fetchCoursesByChannelId(channelId), {
    // The query will not execute until the userId exists
    enabled: !!channelId,
  });
  return <div>DependentQueries</div>;
};

// Ablauf:
// 1) Übergabe der email an die Eltern-Komponente: vishwas@example.com'; das kann in der Realität durch ein Inputfeld erfolgen, dass diesen Wert dann als Props der Elternkomponente übergibt
// 2) Abruf des user-Objekts über http://localhost:4000/users/vishwas@example.com
// 3) Rückgabe des useQuery-Hook: data:user
//    {
//     "id": "vishwas@example.com",
//     "channelId": "codevolution"
//   }
// 4) Extrahierung von codevolution aus dem user-Objekt
// 5) Übergabe der channelId an den zweiten useQuery-Hook und
// 6) Abruf des channels-Objekt über http://localhost:4000/channels/codevolution
