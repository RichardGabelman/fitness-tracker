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
        optionalServices: ['12345678-1234-1234-1234-1234567890ab'],
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('12345678-1234-1234-1234-1234567890ab');
      
      const stepsChar = await service.getCharacteristic('abcd1234-1a2b-3c4d-5e6f-abcdef123456');
      const heartRateChar = await service.getCharacteristic('dcba4321-1a2b-3c4d-5e6f-abcdef654321');

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
          <section>
            <button onClick={connectToDevice}>Connect to Device</button>
          </section>
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
