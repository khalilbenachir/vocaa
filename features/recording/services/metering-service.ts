type MeteringListener = (metering: number) => void;

class MeteringService {
  private listeners: Set<MeteringListener> = new Set();

  subscribe(listener: MeteringListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(metering: number) {
    this.listeners.forEach((listener) => listener(metering));
  }
}

export const meteringService = new MeteringService();
