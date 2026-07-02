import {useState, useEffect} from "react";
import { supabase } from "./services/supabaseClient";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Groceries from "./pages/Groceries";

export default function App() {
  const [session, setSession] = useState(null);
  const [page, setPage] = useState("login");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  
  if (session) {
    return (
      <div>
      <div>
        <span>Logged in as: {session.user.email}</span>
        <button onClick={() => supabase.auth.signOut()}>Log Out</button>
      </div>
      <Groceries displayName={session.user.email} />
      </div>
    );
  }

  return (
    <div>
      {page === "login"?<Login/> : <Signup/>}
      <button onClick={() => setPage(page === "login" ? "signup" : "login")}>
        {page === "login" ? "Go to Signup" : "Go to Login"}
      </button>
    </div>
  );
}