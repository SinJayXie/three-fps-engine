import {
    AnimationAction,
    AnimationClip,
    AnimationMixer,
    Euler,
    Mesh,
    Object3D,
    Quaternion, RepeatWrapping, Texture,
    TextureLoader,
    Vector3
} from "three";
const EMPTY_ANIMATION = new AnimationClip("none", 1, [])
const textureMap = <Map<string, Texture>>new Map()
class MeshController {
    private readonly object: Object3D;
    private readonly animations: AnimationClip[];
    private readonly mixer: AnimationMixer;
    private animationAction: AnimationAction;
    private currentActionName: string;
    constructor(mesh: Mesh | Object3D) {
        this.object = <Object3D>mesh
        this.animations = mesh.animations
        this.mixer = new AnimationMixer(this.object)
        this.animationAction = this.mixer.clipAction(this.animations[0] || EMPTY_ANIMATION)
        this.currentActionName = ""
    }


    /**
     * 获取一个动画
     * @param name
     * @param isFuzzy
     */
    public getAnimation(name: string, isFuzzy?: boolean) {
        if(isFuzzy) {
            return this.animations.find(item => item.name.indexOf(name) !== -1) || false
        } else {
            return this.animations.find(item => item.name === name) || false
        }
    }

    /**
     * 添加其它动画到本模型里面
     * @param animations
     */
    public addAnimation(animations: AnimationClip[]) {
        this.animations.push(...animations)
        return this
    }


    /**
     * 获取动画名称
     */
    public getAnimationName() {
        return this.currentActionName
    }

    /**
     * 设置模型动画
     * @param animation
     * @param timeScale
     */
    public selectAnimation(animation: AnimationClip, timeScale?: number) {
        this.mixer.stopAllAction()
        this.animationAction = this.mixer.clipAction(animation || EMPTY_ANIMATION)
        this.animationAction.setDuration(0)
        this.animationAction.timeScale = timeScale ? timeScale : 1
        this.animationAction.play()
        this.currentActionName = this.animationAction.getClip().name
    }


    public actionPlay() {
        this.animationAction.play()
        return this
    }

    public actionStop() {
        this.animationAction.stop()
        return this
    }

    public getAnimationClip() {
        return this.animations
    }

    public updateAnimation(deltaTime: number) {
        this.mixer.update(deltaTime)
    }


    /**
     * 设置位置
     * @param v
     */
    public setPosition(v: Vector3) {
        this.object.position.copy(v)
        return this
    }


    public getPosition() {
        return this.object.position.clone()
    }

    public setRotation(r: Euler) {
        this.object.rotation.copy(r)
        return this
    }


    /**
     * 获取旋转角
     */
    public getRotation() {
        return this.object.rotation.clone()
    }

    public setQuaternion(q: Quaternion) {
        this.object.quaternion.copy(q)
        return this
    }


    public getObject() {
        return <Mesh>this.object
    }

    public bindMesh(object: Object3D) {
        this.object.add(object)
    }


    public async setTexture(textureName: string, width?: number, height?: number): Promise<Texture> {
        const mesh = <any>this.object
        if(textureMap.has(textureName)) {
            return new Promise(resolve => {
                const texture = new Texture().copy(<Texture>textureMap.get(textureName))
                if(width && height) {
                    texture.wrapT = RepeatWrapping
                    texture.wrapS = RepeatWrapping
                    texture.repeat.set(width || 100, height || 100)
                }
                mesh.material.map = texture
                resolve(<Texture>mesh.material.map)
            })
        }

        return new Promise((resolve, reject) => {
            new TextureLoader().setPath("/textures/").load(textureName, texture_ => {
                const texture = new Texture().copy(texture_)

                if(width && height) {
                    texture.wrapT = RepeatWrapping
                    texture.wrapS = RepeatWrapping
                    texture.repeat.set(width || 100, height || 100)
                }
                // mesh.material.color = new Color(0x000000)

                mesh.material.map = new Texture().copy(texture)
                textureMap.set(textureName, texture)
                resolve(<Texture>mesh.material.map)
            }, () => {}, event => {
                reject(event)
            })
        })
    }


}



export default MeshController
