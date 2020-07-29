import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2';
import './App.css';
import { Object3D } from 'three';

import UploadIcon from './icons/Upload.svg';
import CodeIcon from './icons/Code.svg';
import SwitchIcon from './icons/Switch.svg';
import SettingsIcon from './icons/Settings.svg';

class App extends React.PureComponent {
	state = {
		userUploaded: false
	};

	private scene = new THREE.Scene();
	private camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	private renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	private controls = new OrbitControls(this.camera, this.renderer.domElement);
	private loader = new OBJLoader2();

	private currentSkin = '';
	private currentGun = 'Assault';

	private gunMappings: {[gunId: string]: string} = {
		Assault: 'Assault Rifle'
	};

	componentDidMount() {
		if (!this.mountRef.current) throw new Error('Mount point not found');

		this.mountRef.current.appendChild(this.renderer.domElement);

		// add stuff to the renderer
		const gridHelper = new THREE.GridHelper(100, 100, new THREE.Color(0xFFFFFF));
        gridHelper.position.set(0, -0.75, 0);
		this.scene.add(gridHelper);
		
		this.toDataUrl(`/GunTexture.png`)
			.then(baseUrl => {
				this.loadWithTexture(baseUrl);
			});
	}

	constructor(props: any) {
		super(props);

        this.scene.background = new THREE.Color(0x3a3a3a);
		this.camera.position.set(3, 2, 2);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);

		this.controls.enableDamping = true;
		this.controls.zoomSpeed = 1;
		this.controls.enablePan = false;
		this.controls.minDistance = 1;
		this.controls.maxDistance = 100;

        window.addEventListener('resize', event => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
			this.camera.updateProjectionMatrix();
			
            this.renderer.setPixelRatio(window.devicePixelRatio);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
		});
		
		const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            this.controls.update();
        }
        animate();
	}

	public toDataUrl(url: string) {
		return new Promise<string>(res => {
			const xhr = new XMLHttpRequest();

			xhr.addEventListener('load', event => {
				var reader = new FileReader();
				reader.onloadend = function() {
					res(reader.result?.toString());
				}
				reader.readAsDataURL(xhr.response);
			});

			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		});
	}

	private loadWithTexture = async(textureBase: string) => {
		const mesh = await new Promise<Object3D>((res) => {
			this.loader.load(
				`/${this.currentGun}.obj`,
				object => {
					res(object);
				}
			);
		});

		// making image load on update
		const image = document.createElement('img');
		image.src = textureBase;

		const texture = new THREE.Texture(image);

		image.addEventListener('load', event => {
			texture.needsUpdate = true;
		});

		const shader = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture,
			flatShading: true
		});

		mesh.name = 'Gun';
		mesh.traverse(child => {
			if (child instanceof THREE.Mesh) {
				child.material = shader;
			}
		});

		const oldGun = this.scene.getObjectByName('Gun');
		if (oldGun) {
			this.scene.remove(oldGun);
		}

		this.scene.add(mesh);
	}

	private mountRef = React.createRef<HTMLDivElement>();
	private uploadRef = React.createRef<HTMLInputElement>();

	private uploadPassthrough = () => {
		this.uploadRef.current?.click();
	}

	private fileUploaded = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files || !event.target.files[0]) return;

		const reader = new FileReader();
		reader.addEventListener('load', event => {
			if (!event.target) return;

			this.currentSkin = event.target.result?.toString() || '';
			this.setState({
				userUploaded: true
			});

			this.loadWithTexture(this.currentSkin);
		});

		reader.readAsDataURL(event.target.files[0]);
	}

	render() {
		return <>
			<input type="file" className="hidden" ref={this.uploadRef} onChange={this.fileUploaded}></input>
			<div className="app" ref={this.mountRef}>
				<div className="sidebar">
					<button title="Upload Skin" onClick={this.uploadPassthrough}><img alt="Upload Skin" draggable={false} src={UploadIcon}></img></button>
					<button title="Change Gun"><img alt="Change Gun" draggable={false} src={SwitchIcon}></img></button>
					<button title="Settings"><img alt="Settings" draggable={false} src={SettingsIcon}></img></button>
					<button title="View Source" onClick={() => window.location.href = 'https://github.com/xethlyx/eclipsis-skin-preview'}><img alt="View Source" draggable={false} src={CodeIcon}></img></button>
				</div>
				<div className="info-indicator">
					<p>{this.state.userUploaded ? 'User Content' : 'System Default'}</p>
					<p>{this.gunMappings[this.currentGun]}</p>
				</div>
			</div>
		</>;
	}
}

export default App;