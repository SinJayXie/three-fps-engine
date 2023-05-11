import {Octree} from "three/examples/jsm/math/Octree";
import {OctreeHelper} from "three/examples/jsm/helpers/OctreeHelper";
import {Capsule} from "three/examples/jsm/math/Capsule";
import {Clock, Color, Group, Object3D, PerspectiveCamera, Scene, Vector3} from "three";
import KeyState from "./KeyState";
import PhysicsConfig from "./PhysicsConfig";

class WorldPhysics {
    private readonly worldTree: Octree;
    private readonly playerCollider: Capsule;
    private readonly playerVelocity: Vector3;
    private readonly playerDirection: Vector3;
    private readonly worldTreeHelper: OctreeHelper;
    private readonly keyState: KeyState;
    private readonly scene: Scene;
    private readonly colliders: Group;
    private isInit: boolean;
    private config: PhysicsConfig;
    private readonly clock: Clock;
    private deltaTime: number;
    private playerOnFloor: boolean;
    private camera: PerspectiveCamera;
    constructor(keyState: KeyState, scene: Scene, camera: PerspectiveCamera) {
        this.keyState = keyState
        this.scene = scene;
        this.camera = camera
        this.worldTree = new Octree()
        this.worldTreeHelper = new OctreeHelper(this.worldTree, 0xff0000)
        this.playerCollider = new Capsule( new Vector3( 0, 0.15, 0 ), new Vector3( 0, 1, 0 ), 0.5);
        this.playerVelocity = new Vector3()
        this.playerDirection = new Vector3()
        this.colliders = new Group()
        this.config = new PhysicsConfig()
        this.clock = new Clock()
        this.deltaTime = this.clock.getDelta()
        this.playerOnFloor = false
        this.isInit = false
    }

    public createOctree() {
        if(this.isInit) return
        this.isInit = true
        this.scene.add(this.colliders)
        this.reload()
        this.worldTreeHelper.visible = false
        this.scene.add(this.worldTreeHelper)
    }

    public setConfig(config: PhysicsConfig) {
        this.config = config
    }

    public clear() {
        this.colliders.children.forEach(object => {
            this.colliders.remove(object)
        })
        this.worldTree.triangles = []
        this.worldTree.subTrees = []
        // this.worldTree.build()
    }

    public hideHelper() {
        this.worldTreeHelper.visible = false
    }

    public showHelper() {
        this.worldTreeHelper.visible = true
    }

    public setHelperColor(color: Color | string | number) {
        this.worldTreeHelper.color = color
    }

    public resetPosition(pos: Vector3) {
        const newPos = new Vector3().copy(pos)
        const height = Math.abs(this.playerCollider.end.y - this.playerCollider.start.y)
        this.playerVelocity.set(0, 0, 0)
        this.playerCollider.start.set(newPos.x, newPos.y, newPos.z)
        this.playerCollider.end.set(newPos.x, newPos.y + height, newPos.z)
    }

    public updateObject(obj?: Object3D) {
        if(obj) {
            obj.position.copy(this.playerCollider.end)
        } else {
            this.camera.position.copy(this.playerCollider.end)

        }
    }

    public update() {
        this.deltaTime = this.clock.getDelta()
        const speedDelta = this.deltaTime * (this.playerOnFloor ? this.config.getMoveSpeed() : this.config.getSpaceMoveSpeed());
        const keyStates = this.keyState.allState()
        if (keyStates['KeyW']) this.playerVelocity.add(this.getForwardVector().multiplyScalar(speedDelta))
        if (keyStates['KeyS']) this.playerVelocity.add(this.getForwardVector().multiplyScalar(-speedDelta))
        if (keyStates['KeyA']) this.playerVelocity.add(this.getSideVector().multiplyScalar(-speedDelta))
        if (keyStates['KeyD']) this.playerVelocity.add(this.getSideVector().multiplyScalar(speedDelta))
        if (this.playerOnFloor) if (keyStates['Space']) this.playerVelocity.y = this.config.getJumpSpeed()


        let damping = Math.exp(-this.config.getDamping() * this.deltaTime) - 1;
        if (!this.playerOnFloor) {
            this.playerVelocity.y -= this.config.getGravity() * this.deltaTime;
            // small air resistance
            damping *= 0.1;
        }
        if(this.keyState.getKeyCode('KeyQ')) this.playerVelocity.y = 10
        // this.playerVelocity.y = 0
        this.playerVelocity.addScaledVector(this.playerVelocity, damping);
        const deltaPosition = this.playerVelocity.clone().multiplyScalar(this.deltaTime);
        this.playerCollider.translate( deltaPosition );
        this.playerCollisions();
        //this.camera.position.copy(this.playerCollider.end);



    }

    public getForwardVector(isY?: boolean) {
        this.camera.getWorldDirection(this.playerDirection);
        if(!isY) this.playerDirection.y = 0;
        this.playerDirection.normalize();

        return this.playerDirection.clone();

    }

    public getSideVector() {

        this.camera.getWorldDirection(this.playerDirection);
        this.playerDirection.y = 0;
        this.playerDirection.normalize();
        this.playerDirection.cross(this.camera.up);

        return this.playerDirection;

    }

    public getPosition() {
        return this.playerCollider.end.clone()
    }

    public add(object: Object3D) {
        this.colliders.add(object)
    }

    public remove(object: Object3D) {
        this.colliders.remove(object)
    }

    public reload(isUpdate?: boolean) {
        if(isUpdate) {
            this.worldTree.fromGraphNode(this.colliders)
            this.worldTreeHelper.update()
            return true
        }
        if(this.colliders.children.length > 0) this.worldTree.fromGraphNode(this.colliders)

        this.worldTreeHelper.update()
        return true
    }

    private playerCollisions() {
        const result = this.worldTree.capsuleIntersect(this.playerCollider);
        this.playerOnFloor = false
        if (result) {
            this.playerOnFloor = result.normal.y > 0;
            if(this.keyState.getKeyCode('KeyV')) return // 取消障碍判断
            if (!this.playerOnFloor) this.playerVelocity.addScaledVector(result.normal, -result.normal.dot(this.playerVelocity));
            this.playerCollider.translate( result.normal.multiplyScalar( result.depth ));
        }
    }

    public testCollisions(capsule: Capsule) {
        return this.worldTree.capsuleIntersect(capsule)
    }


    public getColliders() {
        return this.colliders.children
    }
}


export default WorldPhysics
