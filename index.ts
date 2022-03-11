const nowMs = () => new Date().getTime();

const MAX_MINUTES = 15 + 1;
const MAX_SECONDS = MAX_MINUTES * 60;

export class Metrics {
    private values = new Map<number, { count: number, sum: number }>();

    public add(inc: number) {
        this.maintain();

        const time = ~~(nowMs() / 1000);

        const value = this.values.get(time) || { count: 0, sum: 0 };
        value.count++;
        value.sum += inc;
        this.values.set(time, value);
    }

    public tick() {
        this.add(1);
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

    public getAvg(digits = 8) {
        const roundTo = (number: number) => Math.round(number * Math.pow(10, digits)) / Math.pow(10, digits);
        this.maintain();
        return {
            1: roundTo(this._get(1).avg),
            5: roundTo(this._get(5).avg),
            15: roundTo(this._get(15).avg),
        }
    }

    public getCount() {
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

export default Metrics;
