import { render } from "@youwol/flux-view";
import { Core } from "@youwol/platform-essentials";

require("./style.css");

let appView = new Core.PlatformView();

document.getElementById("content").appendChild(render(appView));
