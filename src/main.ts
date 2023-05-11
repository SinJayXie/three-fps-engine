import "./style.scss"
import GameMain from "./Crossfire/GameMain";

const documentElement = <HTMLDivElement>document.querySelector("#app")

new GameMain(documentElement).init()
