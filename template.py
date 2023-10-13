import shutil
from pathlib import Path

from youwol.pipelines.pipeline_typescript_weback_npm import (
    Template,
    PackageType,
    Dependencies,
    RunTimeDeps,
    generate_template,
    DevServer,
    Bundles,
    MainModule,
)
from youwol.utils import parse_json

folder_path = Path(__file__).parent

pkg_json = parse_json(folder_path / "package.json")

template = Template(
    path=folder_path,
    type=PackageType.Application,
    name=pkg_json["name"],
    version=pkg_json["version"],
    shortDescription=pkg_json["description"],
    author=pkg_json["author"],
    dependencies=Dependencies(
        runTime=RunTimeDeps(
            externals={
                "@youwol/fv-tabs": "^0.2.1",
                "@youwol/os-core": "^0.1.2",
                "@youwol/fv-group": "^0.2.1",
                "@youwol/flux-view": "^1.0.3",
                "@youwol/http-clients": "^2.0.1",
                "rxjs": "^6.5.5",
                "uuid": "^8.3.2",
                "@youwol/cdn-client": "^1.0.2",
                "codemirror": "^5.52.0",
                "@youwol/fv-code-mirror-editors": "^0.2.1",
                "@youwol/fv-context-menu": "^0.1.1",
            }
        ),
        devTime={
            #  those two prevent failure of typedoc
            "@types/lz-string": "^1.3.34",
            "lz-string": "^1.4.4",
        },
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./app/index.html",
            loadDependencies=[
                "@youwol/fv-tabs",
                "@youwol/os-core",
                "@youwol/fv-group",
                "@youwol/flux-view",
                "@youwol/http-clients",
                "rxjs",
                "uuid",
                "@youwol/cdn-client",
                "@youwol/fv-context-menu",
            ],
        )
    ),
    userGuide=True,
    devServer=DevServer(port=3004),
)

generate_template(template)

shutil.copyfile(
    src=folder_path / ".template" / "src" / "auto-generated.ts",
    dst=folder_path / "src" / "auto-generated.ts",
)

for file in [
    "README.md",
    ".gitignore",
    ".npmignore",
    ".prettierignore",
    "LICENSE",
    "package.json",
    "tsconfig.json",
    "webpack.config.ts",
]:
    shutil.copyfile(src=folder_path / ".template" / file, dst=folder_path / file)
