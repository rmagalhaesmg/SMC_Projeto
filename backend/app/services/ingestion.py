from typing import Protocol, Iterable, Dict, Any, AsyncIterable


class Tick:
    def __init__(self, ts: float, price: float, size: float, side: str):
        self.ts = ts
        self.price = price
        self.size = size
        self.side = side


class IngestionSource(Protocol):
    async def stream_ticks(self, symbol: str) -> AsyncIterable[Tick]:
        ...

    def load_csv(self, path: str) -> Iterable[Tick]:
        ...


class Aggregator:
    def __init__(self, tick_size: float):
        self.tick_size = tick_size

    def to_ohlcv(self, ticks: Iterable[Tick], interval_sec: int) -> Iterable[Dict[str, Any]]:
        return []

