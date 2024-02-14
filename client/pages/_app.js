import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

// Custom App component that wraps up a page
// To provide global CSS and common components to all pages, we can use the _app.js file
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
};

AppComponent.getInitialProps = async (appContext) => {
  // console.log(appContext)

  const client = buildClient(appContext.ctx);
  const { data } = await client.get("/api/users/currentuser");

  let pageProps = {};

  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(
      appContext.ctx,
      client, // axios instance
      data.currentUser // currentUser
    );
  }

  return {
    pageProps,
    ...data,
  };
};

export default AppComponent;

/*
When we define a getInitialProps function for an app component, getInitialProps will not be called automatically on child components.
*/
