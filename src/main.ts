import "./style.scss"
import GameMain from "./GameMain";

const documentElement = <HTMLDivElement>document.querySelector("#app")

new GameMain(documentElement).init()
