from dataclasses import dataclass
from typing import Dict, List, Optional, Tuple
from math import tanh, fabs


@dataclass
class HFZParams:
    periodo_delta: int = 20
    suavizacao_delta: int = 5
    threshold_delta_forte: float = 1.5
    periodo_hz: int = 60
    threshold_hz_baixo: float = 0.3
    threshold_hz_alto: float = 1.5
    peso_hz_preco: float = 0.5
    peso_hz_fluxo: float = 0.5
    periodo_atr: int = 14
    threshold_absorcao: float = 1.5
    multiplicador_absorcao: float = 1.5
    periodo_imbalance: int = 10
    threshold_imbalance_forte: float = 0.6
    threshold_imbalance_extremo: float = 0.75
    janela_pressao: int = 15
    peso_delta: float = 0.30
    peso_hz: float = 0.25
    peso_absorcao: float = 0.20
    peso_imbalance: float = 0.15
    peso_pressao: float = 0.10


@dataclass
class FBIParams:
    periodo_liquidez: int = 30
    threshold_liquidez_alta: float = 1.8
    min_toques_zona: int = 1
    distancia_merge_zona: float = 0.003
    max_zonas: int = 20
    min_barras_zona: int = 5
    threshold_forca_zona: float = 1.5
    janela_normalizacao_dist: int = 50
    peso_forca: float = 0.40
    peso_distancia: float = 0.30
    peso_tipo: float = 0.20
    peso_reacao: float = 0.10


@dataclass
class DTMParams:
    threshold_trap_volume: float = 1.8
    threshold_trap_renovacao: float = 0.8
    min_barras_trap: int = 3
    janela_continuidade: int = 5
    threshold_falha_cont: float = 0.6
    janela_eficiencia: int = 10
    threshold_eficiencia_baixa: float = 0.4
    periodo_renovacao: int = 10
    threshold_renovacao_real: float = 1.5
    peso_trap: float = 0.40
    peso_continuidade: float = 0.30
    peso_eficiencia: float = 0.20
    peso_renovacao: float = 0.10


@dataclass
class SDAParams:
    periodo_regime: int = 30
    threshold_tendencia: float = 0.6
    threshold_lateral: float = 0.3
    periodo_vol: int = 20
    janela_normalizacao_vol: int = 50
    periodo_continuacao: int = 15
    threshold_continuacao_alta: float = 0.7
    threshold_exaustao_alta: float = 2.5
    janela_deslocamento: int = 20
    peso_regime: float = 0.30
    peso_vol: float = 0.25
    peso_continuacao: float = 0.25
    peso_deslocamento: float = 0.20


@dataclass
class MTVParams:
    threshold_confluencia: float = 0.75
    threshold_divergencia: float = 0.30
    threshold_divergencia_forte: float = 0.85
    threshold_forca_min: float = 0.15
    threshold_expansao_vol: float = 1.5
    threshold_contracao_vol: float = 0.6
    peso_tf_semanal_base: float = 0.35
    peso_tf_diario_base: float = 0.30
    peso_tf_lento_base: float = 0.20
    peso_tf_medio_base: float = 0.10
    peso_tf_rapido_base: float = 0.05
    peso_modulo: float = 0.10


@dataclass
class ScoreParams:
    peso_hfz: float = 0.40
    peso_fbi: float = 0.20
    peso_dtm: float = 0.20
    peso_sda: float = 0.10
    peso_mtv: float = 0.10
    threshold_score_alto: float = 55
    threshold_score_medio: float = 40
    threshold_score_baixo: float = 30
    min_score_operacao: float = 30
    max_trap_permitido: float = 0.6
    min_hz_zona: float = 0.2
    min_vol_normalizada: float = 0.1
    max_distancia_zona: float = 0.050
    min_forca_zona: float = 0.8


@dataclass
class Snapshot:
    price: float
    open: float
    high: float
    low: float
    close: float
    volume: float
    buy_volume: float
    sell_volume: float
    atr: float
    delta: float
    hz: float
    absorcao: float
    imbalance: float
    pressao_compra: float
    pressao_venda: float
    dist_zona: float
    forca_zona: float
    reacao_zona: float
    regime: float
    vol_rel: float
    continuacao: float
    deslocamento: float
    confluencia_tfs: float
    divergencia_tfs: float


@dataclass
class ModuleScores:
    hfz: float
    fbi: float
    dtm: float
    sda: float
    mtv: float
    final: float
    direction: str
    estado_mercado: int
    qualidade_setup: int
    eventos: List[str]


@dataclass
class LiquidityZone:
    price: float
    strength: float
    side: str


@dataclass
class LiquidityParams:
    w_strength: float = 0.7
    w_distance: float = 0.3
    offset_main_atr: float = 0.0
    offset_side_atr: float = 0.5
    min_strength: float = 0.2


class SMCEngine:
    def __init__(
        self,
        hfz: HFZParams = HFZParams(),
        fbi: FBIParams = FBIParams(),
        dtm: DTMParams = DTMParams(),
        sda: SDAParams = SDAParams(),
        mtv: MTVParams = MTVParams(),
        score_params: ScoreParams = ScoreParams(),
        liquidity_params: LiquidityParams = LiquidityParams(),
    ):
        self.hfz = hfz
        self.fbi = fbi
        self.dtm = dtm
        self.sda = sda
        self.mtv = mtv
        self.sp = score_params
        self.liq = liquidity_params

    def _norm(self, x: float, scale: float = 1.0) -> float:
        return max(0.0, min(1.0, 0.5 * (tanh(x / max(1e-9, scale)) + 1.0)))

    def _hfz_score(self, snap: Snapshot) -> Tuple[float, str, List[str]]:
        eventos: List[str] = []
        delta_norm = self._norm(snap.delta, self.hfz.threshold_delta_forte)
        hz_norm = self._norm(snap.hz, self.hfz.threshold_hz_alto)
        abs_norm = self._norm(snap.absorcao, self.hfz.threshold_absorcao)
        imb_norm = self._norm(fabs(snap.imbalance), self.hfz.threshold_imbalance_extremo)
        pressao = snap.pressao_compra - snap.pressao_venda
        press_norm = self._norm(pressao, 1.0)
        score = (
            delta_norm * self.hfz.peso_delta
            + hz_norm * self.hfz.peso_hz
            + abs_norm * self.hfz.peso_absorcao
            + imb_norm * self.hfz.peso_imbalance
            + press_norm * self.hfz.peso_pressao
        )
        direction = "buy" if pressao >= 0 else "sell"
        if delta_norm > 0.8:
            eventos.append("DELTA_FORTE")
        if abs_norm > 0.8:
            eventos.append("ABSORCAO")
        if imb_norm > 0.8:
            eventos.append("IMBALANCE")
        if abs_norm > 0.85 and imb_norm > 0.7 and hz_norm > 0.6:
            eventos.append("ICEBERG_SUSPEITO")
        if imb_norm > 0.9 and hz_norm < 0.4:
            eventos.append("SPOOFING_SUSPEITO")
        return score, direction, eventos

    def _fbi_score(self, snap: Snapshot) -> Tuple[float, List[str]]:
        eventos: List[str] = []
        dist_norm = 1.0 - self._norm(snap.dist_zona, self.sp.max_distancia_zona)
        forca_norm = self._norm(snap.forca_zona, self.fbi.threshold_forca_zona)
        reacao_norm = self._norm(snap.reacao_zona, 1.0)
        tipo_norm = 0.5
        score = (
            forca_norm * self.fbi.peso_forca
            + dist_norm * self.fbi.peso_distancia
            + tipo_norm * self.fbi.peso_tipo
            + reacao_norm * self.fbi.peso_reacao
        )
        if forca_norm > 0.8 and dist_norm > 0.6:
            eventos.append("CONTATO_ZONA")
        return score, eventos

    def _dtm_score(self, snap: Snapshot) -> Tuple[float, List[str]]:
        eventos: List[str] = []
        trap_intensity = self._norm((snap.sell_volume + snap.buy_volume) / max(1.0, snap.volume), 1.0)
        continuidade = self._norm(snap.continuacao, 1.0)
        eficiencia = self._norm(snap.deslocamento / max(1e-9, snap.atr), 1.0)
        renovacao = self._norm((snap.buy_volume - snap.sell_volume) / max(1.0, snap.volume), 1.0)
        score = (
            trap_intensity * self.dtm.peso_trap
            + continuidade * self.dtm.peso_continuidade
            + eficiencia * self.dtm.peso_eficiencia
            + renovacao * self.dtm.peso_renovacao
        )
        if trap_intensity > 0.8:
            eventos.append("TRAP")
        return score, eventos

    def _sda_score(self, snap: Snapshot) -> Tuple[float, int, List[str]]:
        eventos: List[str] = []
        regime = snap.regime
        vol_norm = self._norm(snap.vol_rel, self.mtv.threshold_expansao_vol)
        cont_norm = self._norm(snap.continuacao, 1.0)
        deslc_norm = self._norm(snap.deslocamento / max(1e-9, snap.atr), 1.0)
        score = (
            regime * self.sda.peso_regime
            + vol_norm * self.sda.peso_vol
            + cont_norm * self.sda.peso_continuacao
            + deslc_norm * self.sda.peso_deslocamento
        )
        estado = 1 if regime >= self.sda.threshold_tendencia else (0 if regime <= self.sda.threshold_lateral else 2)
        if vol_norm > 0.8:
            eventos.append("EXPANSAO_VOL")
        return score, estado, eventos

    def _mtv_score(self, snap: Snapshot) -> Tuple[float, List[str]]:
        eventos: List[str] = []
        conf = self._norm(snap.confluencia_tfs, 1.0)
        div = self._norm(snap.divergencia_tfs, 1.0)
        base = max(0.0, conf - div * 0.5)
        score = base
        if conf > self.mtv.threshold_confluencia:
            eventos.append("CONFLUENCIA_MTV")
        if div > self.mtv.threshold_divergencia_forte:
            eventos.append("DIVERGENCIA_FORTE")
        return score, eventos

    def compute(self, snap: Snapshot) -> ModuleScores:
        h_score, h_dir, h_events = self._hfz_score(snap)
        f_score, f_events = self._fbi_score(snap)
        d_score, d_events = self._dtm_score(snap)
        s_score, estado, s_events = self._sda_score(snap)
        m_score, m_events = self._mtv_score(snap)
        final = (
            h_score * self.sp.peso_hfz
            + f_score * self.sp.peso_fbi
            + d_score * self.sp.peso_dtm
            + s_score * self.sp.peso_sda
            + m_score * self.sp.peso_mtv
        )
        direction = h_dir
        qualidade = int(max(1, min(10, round(final * 10))))
        eventos = h_events + f_events + d_events + s_events + m_events
        return ModuleScores(
            hfz=round(h_score, 4),
            fbi=round(f_score, 4),
            dtm=round(d_score, 4),
            sda=round(s_score, 4),
            mtv=round(m_score, 4),
            final=round(final, 4),
            direction=direction,
            estado_mercado=estado,
            qualidade_setup=qualidade,
            eventos=eventos,
        )

    def estimate_liquidity(self, snap: Snapshot) -> List[LiquidityZone]:
        zones: List[LiquidityZone] = []
        base = snap.price
        s = max(0.0, min(1.0, self._norm(snap.forca_zona, 1.5)))
        d = max(0.0, min(1.0, 1.0 - self._norm(snap.dist_zona, 0.05)))
        k = s * self.liq.w_strength + d * self.liq.w_distance
        k = max(self.liq.min_strength, min(1.0, k))
        if self.liq.offset_main_atr != 0.0:
            zones.append(LiquidityZone(price=base + snap.atr * self.liq.offset_main_atr, strength=k, side="mid"))
        else:
            zones.append(LiquidityZone(price=base, strength=k, side="mid"))
        zones.append(LiquidityZone(price=base + snap.atr * self.liq.offset_side_atr, strength=k * 0.8, side="ask"))
        zones.append(LiquidityZone(price=base - snap.atr * self.liq.offset_side_atr, strength=k * 0.8, side="bid"))
        return zones
