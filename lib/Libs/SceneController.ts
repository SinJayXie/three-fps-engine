import {Color, CubeTexture, Object3D, Scene, Texture} from "three";

class SceneController {
    private readonly scene: Scene;
    constructor() {
       this.scene = new Scene()
    }

    public getScene() {
        return this.scene
    }

    public setBackground(background: Color | Texture | CubeTexture | null) {
        this.scene.background = background
        return this
    }

    public add(object: Object3D) {
        this.scene.add(object)
        return this
    }

    public remove(object: Object3D) {
        this.scene.remove(object)
        return this
    }

}


export default SceneController
