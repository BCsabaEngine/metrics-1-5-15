import Metrics from '../index';

const metricCpuLoad = new Metrics();
const countEvents = new Metrics();

setInterval(() => {
    const load = Math.round(Math.random() * 4); //Emulate 4 cpu core with random
    metricCpuLoad.add(load);

    countEvents.tick();
}, 10);

setInterval(() => {
    console.log('Cpu load: ' + JSON.stringify(metricCpuLoad.getAvg()));
    console.log('Cpu load (1m): ' + metricCpuLoad.getAvg(2)[1]);
    console.log('Cpu load (5m): ' + metricCpuLoad.getAvg(2)[5]);
    console.log();

    console.log('Events count: ' + JSON.stringify(countEvents.getCount()));
    console.log();
}, 1000);
