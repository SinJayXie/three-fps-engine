import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {TextureLoader} from "three";
import {LottieLoader} from "three/examples/jsm/loaders/LottieLoader";
import {AMFLoader} from "three/examples/jsm/loaders/AMFLoader";
import {BVHLoader} from "three/examples/jsm/loaders/BVHLoader";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import {CubeTextureLoader} from "three";
import {DDSLoader} from "three/examples/jsm/loaders/DDSLoader";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import {HDRCubeTextureLoader} from "three/examples/jsm/loaders/HDRCubeTextureLoader";
import {GCodeLoader} from "three/examples/jsm/loaders/GCodeLoader";
import {KMZLoader} from "three/examples/jsm/loaders/KMZLoader";
import {KTXLoader} from "three/examples/jsm/loaders/KTXLoader";
import {TTFLoader} from "three/examples/jsm/loaders/TTFLoader";
import {AudioLoader} from "three";
class Loader {
    constructor() {
    }


    public static TTFLoader(url: string) {
        return new TTFLoader().loadAsync(url)
    }
    public static GCodeLoader(url: string) {
        return new GCodeLoader().loadAsync(url)
    }
    public static KMZLoader(url: string) {
        return new KMZLoader().loadAsync(url)
    }
    public static KTXLoader(url: string) {
        return new KTXLoader().loadAsync(url)
    }
    public static HDRCubeTextureLoader(url: string[]) {
        return new HDRCubeTextureLoader().loadAsync(url)
    }
    public static DDSLoader(url: string) {
        return new DDSLoader().loadAsync(url)
    }
    public static DRACOLoader(url: string) {
        return new DRACOLoader().loadAsync(url)
    }
    public static EXRLoader(url: string) {
        return new EXRLoader().loadAsync(url)
    }
    public static FontLoader(url: string) {
        return new FontLoader().loadAsync(url)
    }
    public static AudioLoader(url: string) {
        return new AudioLoader().loadAsync(url)
    }
    public static CubeTextureLoader(url: string[]) {
        return new CubeTextureLoader().loadAsync(url)
    }
    public static ColladaLoader(url: string) {
        return new ColladaLoader().loadAsync(url)
    }

    public static BVHLoader(url: string) {
        return new BVHLoader().loadAsync(url)
    }

    public static AMFLoader(url: string) {
        return new AMFLoader().loadAsync(url)
    }

    public static LottieLoader(url: string) {
        return new LottieLoader().loadAsync(url)
    }
    public static FBXLoader(url: string) {
        return new FBXLoader().loadAsync(url)
    }

    public static ObjLoader(url: string) {
        return new OBJLoader().loadAsync(url)
    }

    public static GLTFLoader(url: string) {
        return new GLTFLoader().loadAsync(url)
    }

    public static TextureLoader(url: string) {
        return new TextureLoader().loadAsync(url)
    }

}


export default Loader
