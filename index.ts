const nowMs = () => new Date().getTime();

const MAX_MINUTES = 15 + 1;
const MAX_SECONDS = MAX_MINUTES * 60;

class Metrics {
    private values = new Map<number, { count: number, sum: number }>();

    protected add(inc: number) {
        this.maintain();

        const time = ~~(nowMs() / 1000);

        const value = this.values.get(time) || { count: 0, sum: 0 };
        value.count++;
        value.sum += inc;
        this.values.set(time, value);
    }

    private _get(minutes: number) {
        let sum = 0;
        let count = 0;

        const time = ~~(nowMs() / 1000);
        for (const key of this.values.keys())
            if (time - key <= minutes * 60) {
                const value = this.values.get(key);
                if (value) {
                    sum += value.sum;
                    count += value.count;
                }
            }

        return { sum: sum, avg: count ? sum / count : 0 };
    }

    protected getAvg(digits = 8) {
        const roundTo = (number: number) => Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
        this.maintain();
        return {
            1: roundTo(this._get(1).avg),
            5: roundTo(this._get(5).avg),
            15: roundTo(this._get(15).avg),
        }
    }

    protected getSum() {
        this.maintain();
        return {
            1: this._get(1).sum,
            5: this._get(5).sum,
            15: this._get(15).sum,
        }
    }

    private lastMaintain = 0;
    private maintain() {
        const now = nowMs();
        if (now - this.lastMaintain < 1000)
            return;

        const time = ~~(now / 1000);
        for (const key of this.values.keys())
            if (time - key > MAX_SECONDS)
                this.values.delete(key);

        this.lastMaintain = now;
    }
}

export class AverageMetrics extends Metrics {
    public setCurrentValue(value: number) {
        super.add(value);
    }

    public getAvgByMinutes(digits = 8) {
        return super.getAvg(digits);
    }
}

export class CounterMetrics extends Metrics {
    public incCounter() {
        super.add(1);
    }

    public incCounterBy(inc: number) {
        super.add(inc);
    }

    public getCountByMinutes() {
        return super.getSum();
    }

    public getCountBySeconds(digits = 8) {
        const mincount = this.getCountByMinutes();
        const roundTo = (number: number) => Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
        return {
            1: roundTo(mincount[1] / 60),
            5: roundTo(mincount[5] / 60),
            15: roundTo(mincount[15] / 60),
        }
    }
}