# Limit Calculator

Professional, classroom-ready web application for limit analysis using symbolic math and guided numeric intuition.

## 1) Executive Summary

Limit Calculator is built for students, teachers, and academic demos where speed and clarity matter.

Instead of showing only one final answer, the app explains the behavior of a function near a target point through:

- symbolic limit computation,
- left/right sampled values,
- clear mathematical rendering,
- and reusable computation history.

In short: this is not just a calculator, it is a limit analysis assistant.

## 2) Mathematical Core

The app computes:

$$
L = \lim_{x \to a} f(x)
$$

It also samples values around $a$ to show trend behavior from both sides.

### Why this matters

- Symbolic result gives mathematical exactness when possible.
- Nearby sampled values provide intuition and verification.
- Combined output helps beginners understand why a limit is valid.

## 3) Feature Matrix

| Capability | What the User Sees | Why It Is Useful |
|---|---|---|
| Function input parsing | Accepts expressions like `(x^2-1)/(x-1)` | Fast entry using familiar notation |
| Automatic syntax normalization | `^` converted to power, `ln` mapped to `log` | Reduces input errors |
| Symbolic limit engine | Exact/near-exact limit output | Reliable mathematics result |
| Table of values | Left and right sample points near `x -> a` | Visual trend analysis |
| Math rendering | Proper formatted expressions via MathJax | Professional and readable display |
| Local history panel | Previous solves can be reloaded or deleted | Faster repeated analysis |
| Input validation | Friendly error messages for invalid inputs | Better user experience |
| Modal result view | Enlarged table/expression presentation | Better for demos and teaching |

## 4) Input Support Reference

| Input Type | Supported Examples | Notes |
|---|---|---|
| Polynomial/Rational | `x^2 - 4`, `(x^2-1)/(x-1)` | Good for removable discontinuities |
| Trigonometric | `sin(x)/x`, `tan(x)` | `sin`, `cos`, `tan`, `cot`, `sec`, `csc` |
| Exponential/Log | `exp(x)`, `log(x)`, `ln(x)` | `ln(x)` is auto-mapped to `log(x)` |
| Constants | `e`, `pi` | Built-in mathematical constants |
| Approach value | `1`, `0`, `pi/2`, `sqrt(2)` | Parsed and simplified before solving |

## 5) Sampling Strategy (How the Table Is Built)

To show the behavior near $x = a$, the app samples:

| Side | Offsets Added to `a` |
|---|---|
| Left side | `-1.0`, `-0.75`, `-0.5`, `-0.25`, `-0.05` |
| Center | `0` (display marker for approach point) |
| Right side | `+0.05`, `+0.25`, `+0.50`, `+0.75`, `+1.00` |

This creates a balanced left-right view of function behavior near the target point.

## 6) User Manual (Beginner Friendly)

### Step 1: Run the App

1. Activate your virtual environment.
2. Install dependencies.
3. Run the app.
4. Open `http://127.0.0.1:5000` in your browser.

### Step 2: Enter a Function

- In `f(x)`, type your expression.
- In `x ->`, type the approach value.

Example:

- `f(x): (x^2-1)/(x-1)`
- `x -> 1`

### Step 3: Click Calculate

The app returns:

- formatted limit expression,
- computed limit value,
- and a table of nearby values.

### Step 4: Review History

Use the `History` panel to:

- reopen prior entries,
- compare results,
- delete specific records.

## 7) System Behavior and Validation

| Scenario | System Behavior |
|---|---|
| Empty function input | Shows `Function is required.` |
| Empty approach value | Shows `Approach value is required.` |
| Invalid approach value | Shows `Approach value is invalid.` |
| Non-real approach value | Shows `Approach value must be real.` |
| Undefined/non-finite evaluation | Displays `undefined` in output where needed |

## 8) Architecture (Code Map)

### Project tree

```text
LIMIT CALCULATOR/
|-- app.py
|-- requirements.txt
|-- README.md
|-- limit_calculator/
|   |-- __init__.py
|   |-- web/
|   |   |-- __init__.py
|   |   `-- routes.py
|   `-- services/
|       |-- __init__.py
|       `-- limit_service.py
|-- templates/
|   `-- structure.html
`-- static/
	|-- css/
	|   `-- style.css
	`-- js/
		|-- ui.js
		`-- history.js
```

### Responsibility table

| Path | Role |
|---|---|
| `app.py` | Thin entrypoint to start Flask app |
| `limit_calculator/__init__.py` | App factory and blueprint registration |
| `limit_calculator/web/routes.py` | HTTP route handling and template rendering |
| `limit_calculator/services/limit_service.py` | Parsing, symbolic limit computation, numeric sampling |
| `templates/structure.html` | Main user interface layout |
| `static/css/style.css` | Visual styling |
| `static/js/ui.js` | Modal and interface interactions |
| `static/js/history.js` | History storage/reload/delete logic |

## 9) Request-to-Result Flow

```text
User Input -> Flask Route -> Parse/Sanitize -> Compute Limit + Build Sample Table -> Render Template -> Display Result + Save History
```

## 10) Installation and Run

### Requirements

- Python 3.10+
- pip

### Commands

```bash
pip install -r requirements.txt
python app.py
```

Open:

```text
http://127.0.0.1:5000
```

## 11) Quick Demo Cases

| Function `f(x)` | Approach `a` | Expected Idea |
|---|---|---|
| `(x^2-1)/(x-1)` | `1` | Removable discontinuity, limit tends to `2` |
| `sin(x)/x` | `0` | Classic fundamental limit, tends to `1` |
| `1/x` | `0` | One-sided behaviors differ in sign; limit may be undefined/infinite behavior |

## 12) Why This Project Is Strong

- Clean modular architecture (web and math logic separated).
- Strong user experience for both beginner and advanced users.
- Educationally aligned output: symbolic + numerical intuition.
- Ready for extension (more functions, graphing, API endpoints, assessments).

If you are presenting this to a client, this project already demonstrates a practical, maintainable, and mathematically credible solution for learning-focused computation tools.
