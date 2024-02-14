import Link from "next/link";

const Landing = ({ currentUser, tickets }) => {
  console.log(tickets);

  const ticketList = tickets.map((ticket) => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          View
        </Link>
      </td>
    </tr>
  ));

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

// Next.js is going to call this function while it is attempting to render the application on the server
// It gives the opportunity to attempt to fetch some data that this component needs during SSR process
// getInitialProps is automatically called on the server when Next.js decides to show this component
// Any data returned from getInitialProps will be available as props to the component
// Executed on the server
Landing.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get("/api/tickets");

  return { tickets: data };
};

export default Landing;

/*
We cannot do any kind of data fetching inside of a component that is being rendered on the server
All of our components are going to be rendered one single time on the server
So we cannot make a request, wait for the response and possibly try to update a state

But when we are on the browser, we can make a request to the API server and get the data
*/
