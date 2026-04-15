from flask import Flask


def create_app() -> Flask:
    app = Flask(
        __name__,
        template_folder="../templates",
        static_folder="../static",
    )

    from .web.routes import web_bp

    app.register_blueprint(web_bp)
    return app
