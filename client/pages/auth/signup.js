import { useState } from "react";
import { useRequest } from "../../hooks/use-request";
import Router from "next/router";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => Router.push("/"),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await doRequest();
  };

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>Sign Up</h2>
      <div className="form-group mt-4">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          id="email"
        />
      </div>
      <div className="form-group mt-4">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          id="password"
        />
      </div>
      {errors}
      <button className="btn btn-primary mt-3">Sign Up</button>
    </form>
  );
};

export default Signup;
