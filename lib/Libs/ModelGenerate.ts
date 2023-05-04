import {
    BoxGeometry, ColorRepresentation, IcosahedronGeometry,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    // RepeatWrapping,
    // TextureLoader
} from "three";

export interface TextureConfig {
    width?: number,
    height?: number
    path?: string
}
class ModelGenerate {
    constructor() {
    }


    /**
     * 创建盒子
     * @param width
     * @param height
     * @param depth
     * @param widthSegments
     * @param heightSegments
     * @param depthSegments
     */
    public static box(width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number) {
        const geometry = new BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
        const material = new MeshBasicMaterial({ color: 0xffffff })
        return new Mesh(geometry, material)
    }

    public static sphere(radius?: number, detail?: number, color?: ColorRepresentation) {
        const geometry = new IcosahedronGeometry(radius || 1, detail || 0)
        const material = new MeshBasicMaterial({ color })
        return new Mesh(geometry, material)
    }

    /**
     * 创建地面
     * @param width
     * @param height
     * @param texture
     */
    public static plane(width: number, height: number) {
        const geometry = new PlaneGeometry(width, height)
        // const texture_ = new TextureLoader().setPath('textures/').load(texture?.path ? texture?.path : 'pavement.jpg');
        // texture_.wrapT = RepeatWrapping
        // texture_.wrapS = RepeatWrapping
        // texture_.repeat.set(texture.width || 100, texture.height || 100)
        const material = new MeshBasicMaterial({  })
        const grass = new Mesh(geometry, material)
        grass.rotation.x = -0.5 * Math.PI;

        return grass
    }
}

export default ModelGenerate
