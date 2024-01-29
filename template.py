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
                "marked": "^4.2.3",
                "@youwol/os-core": "^0.2.0",
                "@youwol/http-clients": "^3.0.1",
                "uuid": "^8.3.2",
                "codemirror": "^5.52.0",
                "@youwol/rx-context-menu-views": "^0.2.0",
                "@youwol/rx-tab-views": "^0.3.0",
                "@youwol/rx-group-views": "^0.3.0",
                "@youwol/rx-vdom": "^1.0.1",
                "rxjs": "^7.5.6",
                "@youwol/rx-code-mirror-editors": "0.5.0",
                "@youwol/webpm-client": "^3.0.0",
            }
        ),
        devTime={
            #  those two prevent failure of typedoc
            "lz-string": "^1.4.4",
        },
    ),
    bundles=Bundles(
        mainModule=MainModule(
            entryFile="./app/index.html",
            loadDependencies=[
                "@youwol/rx-tab-views",
                "@youwol/os-core",
                "@youwol/rx-group-views",
                "@youwol/rx-vdom",
                "@youwol/http-clients",
                "rxjs",
                "uuid",
                "@youwol/webpm-client",
                "@youwol/rx-context-menu-views",
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
