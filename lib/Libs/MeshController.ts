import {AnimationAction, AnimationClip, AnimationMixer, Euler, Mesh, Object3D, Quaternion, Vector3} from "three";

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
        this.animationAction = this.mixer.clipAction(this.animations[0] || new AnimationClip())
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
        this.animationAction = this.mixer.clipAction(animation || new AnimationClip())
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

}



export default MeshController
