import { CoreEngine, ModelGenerate, THREE } from "../../lib/main"
import {Mesh, Raycaster, Vector3} from "three";
import MeshController from "../../lib/Libs/MeshController";
import {Capsule} from "three/examples/jsm/math/Capsule";
import WeaponsController from "./Controller/WeaponsController";

interface AmmoSphereOption {
    mesh: MeshController,
    velocity: Vector3,
    createTime: number,
    distance: number,
    isStop: boolean,
    clearTime: number,
    birthPoint: Vector3,
    endPoint: Vector3,
    capsule: Capsule
}

class GameMain {
    private readonly container: HTMLElement;
    private contentElement: HTMLDivElement;
    private readonly engine: CoreEngine;
    private recoilBox: Mesh;

    private ammoSphere: Map<number, AmmoSphereOption>;
    private weapons: WeaponsController;
    constructor(el: HTMLElement) {
        this.container = el
        this.contentElement = document.createElement('div')
        this.engine = new CoreEngine(this.contentElement)
        this.recoilBox = new Mesh()

        this.ammoSphere = new Map()
        this.weapons = new WeaponsController()
    }


    public async init() {
        this.contentElement.classList.add("fps-engine-frame")
        this.container.appendChild(this.contentElement)
        const mesh = ModelGenerate.plane(30, 30)
        mesh.setPosition(new THREE.Vector3(0, -1, 0))
        await mesh.setTexture("DUST2_PNG/dust2_[050].png", 10, 10)
        const box = ModelGenerate.box(2, 2, 2)
        await box.setTexture("DUST2_PNG/ds_boxside.png", 1, 1)
        box.getObject().position.z -= 5

        this.loadImages()

        mesh.getObject().visible = false
        this.engine.addMesh(mesh.getObject(), true)
        //this.engine.addMesh(box.getObject(), true)
        this.recoilBox.add(this.engine.camera.getCamera())
        this.engine.addMesh(this.recoilBox)
        this.engine.camera.setFov(45)

        this.weapons.setFireCallBack(this.fireHandler, this)

        setTimeout(() => {
            this.engine.camera.setAspect(this.engine.getSize().height / this.engine.getSize().width)
            this.engine.start(this.update, this)
        }, 10)
    }

    public loadImages() {
        const ctx = this.engine.getCanvasContent()
        ctx.loadImage('test', '/textures/DUST2_PNG/dust2_[001].png')
    }


    public update() {
        this.engine.worldPhysics.updateObject(this.recoilBox)

        if(this.engine.worldPhysics.getPosition().y < -20) {
            this.engine.worldPhysics.resetPosition(new THREE.Vector3())
        }

        if(this.engine.keyState.getKeyCode("MouseLeft")) this.weapons.fire()
        this.updateAmmo()
        this.drawCanvas()

        this.updateWeaponsRecoil()
    }


    public updateWeaponsRecoil() {
        this.weapons.setMeshRecoil(this.recoilBox, this.engine.camera)
        this.weapons.update()
    }

    public fireHandler(weapons: WeaponsController) {
        weapons.getRecoil()
        const centerPoint = new Vector3(((this.engine.getSize().width / 2) / this.engine.getSize().width) * 2 - 1,-((this.engine.getSize().height / 2) / this.engine.getSize().height) * 2 + 1, -0.5)
        centerPoint.unproject(this.engine.camera.getCamera())
        const ammoCreateTime = Date.now()
        const ammoMesh = ModelGenerate.sphere(0.02, 2, "red")
        const cameraPoint = this.engine.worldPhysics.getPosition()
        ammoMesh.setPosition(centerPoint.clone())
        const ammoOption = {
            mesh: ammoMesh,
            createTime: ammoCreateTime,
            velocity: this.engine.worldPhysics.getForwardVector(true),
            distance: 50,
            isStop: false,
            clearTime: 0,
            birthPoint: centerPoint.clone(),
            capsule: new Capsule(centerPoint.clone(), centerPoint.clone(), 0.2),
            endPoint: new Vector3()
        }



        const ray = new Raycaster(cameraPoint, centerPoint.sub(cameraPoint).normalize(), 1, ammoOption.distance)

        const result = ray.intersectObjects(this.engine.worldPhysics.getColliders(), false)
        if(result.length > 0) {
            ammoOption.endPoint = result[0].point.clone()
            // result[0].object.position.addScaledVector(ammoOption.velocity, 0.1)
           // this.engine.worldPhysics.reload()
        }

        this.engine.addMesh(ammoMesh.getObject())

        this.ammoSphere.set(ammoCreateTime, ammoOption)

    }


    private updateAmmo() {
        this.ammoSphere.forEach((ammoOption, key) => {
            if(ammoOption.isStop) {
                if(ammoOption.clearTime < Date.now()) {
                    this.ammoSphere.delete(key)
                    this.engine.removeMesh(ammoOption.mesh.getObject())
                }
            } else {
                ammoOption.mesh.getObject().position.addScaledVector(ammoOption.velocity, 1)

                ammoOption.capsule.start = ammoOption.mesh.getPosition()
                ammoOption.capsule.end = ammoOption.mesh.getPosition()
                if(ammoOption.birthPoint.distanceTo(ammoOption.mesh.getPosition()) > ammoOption.distance) { // 超出射程删除子弹
                    this.ammoSphere.delete(key)
                    this.engine.removeMesh(ammoOption.mesh.getObject())
                } else {
                    if(ammoOption.mesh.getPosition().distanceTo(ammoOption.endPoint) < 1) {
                        ammoOption.isStop = true
                        ammoOption.clearTime = Date.now() + 5000
                        ammoOption.mesh.setPosition(ammoOption.endPoint)
                    }
                }
            }



        })
    }

    private drawCanvas() {
        const ctx = this.engine.getCanvasContent()
        ctx.clear()
        ctx.drawText("Hello world !!!", 200, 200, 70, "red")
    }
}


export default GameMain
