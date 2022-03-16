import { AverageMetrics, CounterMetrics } from '../index';

const metricCpuLoad = new AverageMetrics();
const countEvents = new CounterMetrics();

setInterval(() => {
    const load = Math.random() * 4; //Emulate 4 cpu core with random
    metricCpuLoad.setCurrentValue(load);

    countEvents.incCounter()
    countEvents.incCounterBy(Math.round(load))
}, 10);

setInterval(() => {
    console.log('Cpu load: ' + JSON.stringify(metricCpuLoad.getAvgByMinutes()));
    console.log('Cpu load (1m): ' + metricCpuLoad.getAvgByMinutes(2)[1]);
    console.log('Cpu load (5m): ' + metricCpuLoad.getAvgByMinutes(2)[5]);
    console.log();

    console.log('Events count: ' + JSON.stringify(countEvents.getCountByMinutes()));
    console.log('Events count: ' + JSON.stringify(countEvents.getCountBySeconds(3)));
    console.log();
}, 1000);
