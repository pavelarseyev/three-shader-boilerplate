import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

export default class Sketch {
    constructor (options) {
        this.time = 0;
        this.container = options.dom;
        this.scene = new THREE.Scene();

        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.01, 10 );
        this.camera.position.z = 1;

        this.renderer = new THREE.WebGLRenderer({ 
                antialias: true
            });
        this.renderer.setSize(this.width, this.height);
	    this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        this.resize();
        this.setupResize();
        this.addObjects();
        this.render();
    } 

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this))
    }

    resize() {
        //recalculate the width and height
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        //change the size of the renderer
        this.renderer.setSize(this.width, this.height);

        //change the camera
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        this.geometry = new THREE.PlaneGeometry(4, 4, 100, 50);

        //common material (for example)
        // this.material = new THREE.MeshNormalMaterial();

        //shader material
        this.material = new THREE.ShaderMaterial({
            // for passing the cpu data to the shaders
            uniforms: {
                time: { value: 0}
            },
            fragmentShader: fragment,
            vertexShader: vertex,
            side: THREE.DoubleSide,
            // wireframe: true,
        });
    
        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add(this.mesh);
    }

    render() {
        this.time += 0.05;

        // this.mesh.rotation.x = this.time / 2000;
        // this.mesh.rotation.y = this.time / 1000;

        this.material.uniforms.time.value = this.time;

        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(this.render.bind(this));
    }
}

new Sketch({
    dom: document.getElementById('container')
});