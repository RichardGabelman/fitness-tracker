import { useState } from "react";
import "./App.css";
import Icon from '@mdi/react';
import { mdiHeartPulse, mdiRun } from '@mdi/js';

function App() {
  const [steps, setSteps] = useState(null);
  const [heartRate, setHeartRate] = useState(null);
  const [connected, setConnected] = useState(false);

  const connectToDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{name: 'FitnessTracker'}],
        optionalServices: ['180a'],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('180a');
      
      const stepsChar = await service.getCharacteristic('2a53');
      const heartRateChar = await service.getCharacteristic('2a37');

      stepsChar.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value.getUint8(0);
        setSteps(value);
      });
      await stepsChar.startNotifications();

      heartRateChar.addEventListener('characteristicvaluechanged', (event) => {
        const value = event.target.value.getUint8(0);
        setHeartRate(value);
      });
      await heartRateChar.startNotifications();

      setConnected(true);
    } catch (err) {
      console.error('Bluetooth connection failed: ', err);
    }
  };

  return (
    <>
      <header>CS578 Fitness Tracker</header>
      <main>
        {!connected && (
          <button onClick={connectToDevice}>Connect to Device</button>
        )}
        {connected && (
        <section>
          <article>
            <Icon path={mdiRun} size={6} color="green"/>
            <h2>Steps: {steps !== null ? steps : 'Loading...'}</h2>
          </article>
          <article>
            <Icon path={mdiHeartPulse} size={6} color="red"/>
            <h2>Heart Rate: {heartRate !== null ? heartRate : 'Loading...'}</h2>
          </article>
        </section>
        )}
      </main>
      <footer>Copyright &copy; {new Date().getFullYear()} CS578 Group 2</footer>
    </>
  );
}

export default App;
