# NodeJS metrics collector like linux 1,5 and 15 minute metrics

Linux has a smart little metric that shows averages every 1, 5, and 15 minutes. It is usually used to measure CPU load, but is good for any other value, such as disk usage or temperature. The 1 minute value is a good indication of how busy the system is right now. The 5 and 15 minute values show the values of their medium and long-term average loads.

If you want to use this useful linux capability in NodeJS as well, add the metrics-1-5-15 package to your project!

Add to project:
```
npm i metrics-1-5-15
```

Use for numeric values:

```
import Metrics from 'metrics-1-5-15';

const metricCpuLoad = new Metrics();

const load = Math.round(Math.random() * 4); //Emulate 4 cpu core with random
metricCpuLoad.add(load);

metricCpuLoad.getAvg()     // Display averages
metricCpuLoad.getAvg(2)    // Display averages with 2 decimals
metricCpuLoad.getAvg(2)[5] // Display 5 minutes average with 2 decimals
```

In addition to averaging, you can also use it to count something with it:

```
import Metrics from 'metrics-1-5-15';

const networkBytes = new Metrics();

const load = Math.round(Math.random() * 2000); //Emulate network load
networkBytes.add(load);

networkBytes.getSum()    // Display summary
networkBytes.getSum()[5] // 5 minute summary
```

See the ```examples``` folder for more examples.
