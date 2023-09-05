from youwol.app.environment import YouwolEnvironment
from youwol.app.environment.models import IPipelineFactory
from youwol.app.environment.models_project import BrowserApp, Execution, Link, BrowserAppGraphics
from youwol.pipelines.pipeline_typescript_weback_npm import pipeline, PipelineConfig, PublishConfig
from youwol.utils.context import Context


class PipelineFactory(IPipelineFactory):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    async def get(self, env: YouwolEnvironment, context: Context):
        config = PipelineConfig(target=BrowserApp(
            displayName="Platform",
            execution=Execution(
                standalone=True
            ),
            links=[
                Link(name="doc", url="dist/docs/index.html"),
                Link(name="coverage", url="coverage/lcov-report/index.html"),
                Link(name="bundle-analysis", url="dist/bundle-analysis.html")
            ],
            graphics=BrowserAppGraphics(
                appIcon={'class': 'fas fa-puzzle-piece fa-2x'},
                fileIcon={}
            ),

        ),
            publishConfig=PublishConfig(
                packagedArtifacts=["dist", "docs", "test-coverage"],
                packagedFolders=["assets"],
            )
        )
        return await pipeline(config, context)
