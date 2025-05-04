import { useState } from "react";
import "./App.css";
import Icon from '@mdi/react';
import { mdiHeartPulse, mdiRun } from '@mdi/js';

function App() {
  const [steps, setSteps] = useState(0);
  const [heartrate, setHeartrate] = useState(0);

  return (
    <>
      <header>CS578 Fitness Tracker</header>
      <main>
        <section>
          <article>
            <Icon path={mdiRun} size={6} color="green"/>
            <h2>Steps: {steps}</h2>
          </article>
          <article>
            <Icon path={mdiHeartPulse} size={6} color="red"/>
            <h2>Heart Rate: {heartrate}</h2>
          </article>
        </section>
      </main>
      <footer>Copyright &copy; {new Date().getFullYear()} CS578 Group 2</footer>
    </>
  );
}

export default App;
