
export class CircularBuffer {
  size: number;
  data: Float32Array;
  index: number;
  count: number;

  constructor(size: number) {
    this.size = size;
    this.data = new Float32Array(size);
    this.index = 0;
    this.count = 0; // Tracks how many indices of the array have been filled
  }

  push(value: number) {
    this.data[this.index] = value;
    this.index = (this.index + 1) % this.size; // Wrap around to the start
    if (this.count < this.size) this.count++;
  }

  getAverage() {
    if (this.count === 0) return 0;
    let sum = 0;
    for (let i = 0; i < this.count; i++) {
      sum += this.data[i];
    }
    return sum / this.count;
  }

  getAverageDelta() {
    if (this.count < 2) return 0;
    let sum = 0;
    for (let i = 1; i < this.count; i++) {
      sum += Math.abs(this.data[i-1] - this.data[i]);
    }
    return sum / this.count;
  }
}
