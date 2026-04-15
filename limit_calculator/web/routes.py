from __future__ import annotations

from typing import List

from flask import Blueprint, render_template, request
from sympy import latex

from ..services import (
    build_sequence,
    compute_limit_value,
    format_number,
    parse_function,
    parse_limit_point,
)

web_bp = Blueprint("web", __name__)


@web_bp.route("/", methods=["GET", "POST"])
def index():
    function_input = request.form.get("function", "")
    approach_input = request.form.get("approach", "")
    errors: List[str] = []
    result = None

    if request.method == "POST":
        try:
            expression = parse_function(function_input)
            approach_value = parse_limit_point(approach_input)

            result = {
                "approach": format_number(approach_value),
                "sequence": build_sequence(expression, approach_value),
                "latex": latex(expression),
                "user_func": function_input.strip(),
                "display_expr": latex(expression),
                "limit_value": compute_limit_value(expression, approach_value),
            }
        except ValueError as err:
            errors.append(str(err))
        except Exception:
            errors.append("An unexpected error occurred while processing the request.")

    return render_template(
        "structure.html",
        form_data={"function": function_input, "approach": approach_input},
        errors=errors,
        result=result,
    )
