import { useEffect } from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const Signout = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},
    onSuccess: () => Router.push("/"),
  });

  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div>
      <h1>Signing you out...</h1>
    </div>
  );
};

export default Signout;
