from __future__ import annotations

import math
from dataclasses import dataclass
from typing import List, Optional

from sympy import (
    E,
    Expr,
    Float,
    N,
    Symbol,
    SympifyError,
    cos,
    csc,
    cot,
    exp,
    limit,
    log,
    nsimplify,
    oo,
    pi,
    sec,
    sin,
    tan,
    zoo,
)
from sympy.parsing.sympy_parser import (
    convert_xor,
    implicit_multiplication_application,
    parse_expr,
    standard_transformations,
)

X_SYMBOL = Symbol("x")
TRANSFORMATIONS = standard_transformations + (
    implicit_multiplication_application,
    convert_xor,
)
LOCAL_DICT = {
    "x": X_SYMBOL,
    "e": E,
    "pi": pi,
    "sin": sin,
    "cos": cos,
    "tan": tan,
    "cot": cot,
    "sec": sec,
    "csc": csc,
    "exp": exp,
    "log": log,
}


@dataclass
class SamplePoint:
    x_value: float
    fx_value: Optional[str]
    x_latex: str = ""
    fx_latex: str = ""

    @property
    def x_display(self) -> str:
        return format_number(self.x_value)

    @property
    def fx_display(self) -> str:
        return self.fx_value if self.fx_value is not None else "undefined"


def parse_function(raw_expression: str) -> Expr:
    cleaned = raw_expression.strip()
    if not cleaned:
        raise ValueError("Function is required.")

    normalized = cleaned.replace("^", "**").replace("ln", "log")
    try:
        return parse_expr(
            normalized,
            transformations=TRANSFORMATIONS,
            local_dict=LOCAL_DICT,
            evaluate=True,
        )
    except (SympifyError, TypeError) as exc:
        raise ValueError("Unable to interpret the function. Check the syntax.") from exc


def parse_limit_point(raw_value: str) -> float:
    cleaned = raw_value.strip()
    if not cleaned:
        raise ValueError("Approach value is required.")

    try:
        symbolic_value = nsimplify(cleaned)
    except SympifyError as exc:
        raise ValueError("Approach value is invalid.") from exc

    if symbolic_value.is_real is False:
        raise ValueError("Approach value must be real.")

    return float(N(symbolic_value, 12))


def evaluate_at(expr: Expr, point: float) -> Optional[str]:
    substituted = expr.subs(X_SYMBOL, Float(point))
    if substituted.has(zoo, oo, -oo):
        return None

    numeric = N(substituted, 12)
    if numeric.has(zoo, oo, -oo):
        return None

    if numeric.is_real is False:
        return str(numeric)

    approximation = float(numeric)
    if not math.isfinite(approximation):
        return None

    return format_number(approximation)


def build_sequence(expr: Expr, approach: float) -> List[SamplePoint]:
    left_offsets = [-1.0, -0.75, -0.5, -0.25, -0.05]
    right_offsets = [0.05, 0.25, 0.50, 0.75, 1.00]

    sequence: List[SamplePoint] = []

    for offset in left_offsets:
        point = approach + offset
        sequence.append(
            SamplePoint(
                x_value=point,
                fx_value=evaluate_at(expr, point),
                x_latex="",
                fx_latex="",
            )
        )

    sequence.append(SamplePoint(x_value=approach, fx_value="x", x_latex="", fx_latex=""))

    for offset in right_offsets:
        point = approach + offset
        sequence.append(
            SamplePoint(
                x_value=point,
                fx_value=evaluate_at(expr, point),
                x_latex="",
                fx_latex="",
            )
        )

    return sequence


def compute_limit_value(expr: Expr, approach: float) -> str:
    try:
        limit_value = limit(expr, X_SYMBOL, approach)
        if hasattr(limit_value, "is_real") and limit_value.is_real:
            return format_number(float(limit_value.evalf(12)))
        return str(limit_value)
    except Exception:
        return "undefined"


def format_number(value: float) -> str:
    if value == 0:
        return "0"

    absolute = abs(value)
    if absolute >= 1e6 or (absolute and absolute < 1e-4):
        return f"{value:.5e}"

    candidate = f"{value:.5f}".rstrip("0").rstrip(".")
    return candidate if candidate else "0"
