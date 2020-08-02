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

import Settings from './Settings';
import GunSelector from './GunSelector';
import gunMappings from './gunMappings';
import ContextMenu, { ContextMenuEntry } from './ContextMenu';

const githubLink = 'https://github.com/xethlyx/eclipsis-skin-preview';

class App extends React.PureComponent {
	state = {
		userUploaded: false,
		settingsShown: false,
		gunSelectorShown: false,

		contextName: '',
		contextMenu: [] as Array<ContextMenuEntry>
	};

	private buttonContextMap: {[button: string]: Array<ContextMenuEntry>} = {
		upload: [
			{
				name: 'Reset Skin',
				callback: () => this.loadDefaultSkin()
			}
		],
		change: [
			{
				name: 'Refresh Gun Objects',
				callback: () => this.cacheGuns()
			}
		],
		settings: [
			{
				name: 'Reset Settings',
				callback: () => {
					localStorage.removeItem('settings');
					window.location.reload(false);
				}
			}
		],
		source: [
			{
				name: 'Open link in current tab',
				callback: () => window.location.href = githubLink
			},
			{
				name: 'Open link in new tab',
				callback: () => window.open(githubLink, '_BLANK')
			},
			{
				name: 'Copy link to clipboard',
				callback: () => navigator.clipboard.writeText(githubLink)
			}
		]
	}

	private scene = new THREE.Scene();
	private camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	private renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	private controls = new OrbitControls(this.camera, this.renderer.domElement);

	private currentSkin = '';
	private currentGun = 'Assault';

	private lastGunId: null | number = null;
	private oneTabPolicy = false;
	private autoCloseGunSelector = false;

	public gunMeshCache: {[gunId: string]: Object3D} = {};

	componentDidMount() {
		if (!this.mountRef.current) throw new Error('Mount point not found');

		this.mountRef.current.appendChild(this.renderer.domElement);

		// add stuff to the renderer
		const gridHelper = new THREE.GridHelper(100, 100, new THREE.Color(0xFFFFFF));
		gridHelper.name = 'Grid';
        gridHelper.position.set(0, -0.75, 0);
		this.scene.add(gridHelper);
		
		this.loadDefaultSkin();
	}

	private loadDefaultSkin = () => {
		this.toDataUrl(`GunTexture.png`)
			.then(baseUrl => {
				this.currentSkin = baseUrl;
				this.loadWithTexture(this.currentSkin);
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

		this.cacheGuns();
		
		const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
            this.controls.update();
        }
		animate();
	}

	private cacheGuns = () => {
		Object.keys(gunMappings).forEach(async gunName => {
			const loader = new OBJLoader2();

			loader.load(
				`${gunName}.obj`,
				mesh => {
					this.gunMeshCache[gunName] = mesh;
				}
			);
		});
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
		const mesh = this.gunMeshCache[this.currentGun];

		if (!mesh) {
			console.warn(`Gun ${this.currentGun} not found! Is it still loading?`);
			return;
		}

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

		mesh.traverse(child => {
			if (child instanceof THREE.Mesh) {
				child.material = shader;
			}
		});

		if (this.lastGunId) {
			const lastGun = this.scene.getObjectById(this.lastGunId);

			if (lastGun) this.scene.remove(lastGun);
		}
		this.lastGunId = mesh.id;
		

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

	private toggleSettings = () => {
		this.setState({
			gunSelectorShown: this.oneTabPolicy ? false : this.state.gunSelectorShown,
			settingsShown: !this.state.settingsShown
		});
	}

	private attemptAutoCloseGunSelector = () => {
		if (this.autoCloseGunSelector) {
			this.setState({
				gunSelectorShown: false
			});
		}
	}

	private toggleGunSelector = () => {
		this.setState({
			settingsShown: this.oneTabPolicy ? false : this.state.settingsShown,
			gunSelectorShown: !this.state.gunSelectorShown
		});
	}

	private settingChanged = (settingChanged: string, newValue: any) => {
		console.log(`Settings ${settingChanged} was changed to ${newValue}`);

		switch(settingChanged) {
			case 'movementSmoothing':
				this.controls.enableDamping = newValue;
				break;
			case 'movementSmoothingFactor':
				this.controls.dampingFactor = newValue;
				break;
			case 'panningLocked':
				this.controls.enablePan = !newValue;
				break;
			case 'cameraZoomRate':
				this.controls.zoomSpeed = newValue;
				break;
			case 'showGrid':
				const grid = this.scene.getObjectByName('Grid');
				if (grid) grid.visible = newValue;
				break;
			case 'oneTabPolicy':
				this.oneTabPolicy = newValue;
				break;
			case 'autoCloseGunSelector':
				this.autoCloseGunSelector = newValue;
				break;
			case 'backgroundColor':
				this.scene.background = new THREE.Color(Number.parseInt(newValue, 16));
				break;
			default:
				console.warn(`Property ${settingChanged} was changed, but no handler was attached!`);
		}
	}

	private selectGun = (gunSelected: string) => {
		this.currentGun = gunSelected;

		this.attemptAutoCloseGunSelector();
		this.loadWithTexture(this.currentSkin);
		this.forceUpdate();
	}

	private resetContext = () => {
		this.setState({
			contextMenu: []
		})
	}

	private setContext = (caller: string) => {
		this.setState({
			contextName: caller.toUpperCase(),
			contextMenu: this.buttonContextMap[caller]
		});
	}

	render() {
		return <>
			<ContextMenu reference={this.state.contextName} entries={this.state.contextMenu} />
			<input type="file" className="hidden" ref={this.uploadRef} onChange={this.fileUploaded}></input>
			<div className="app" ref={this.mountRef}>
				<div className="sidebar">
					<button title="Upload Skin" onMouseLeave={this.resetContext} onMouseEnter={() => this.setContext('upload')} onClick={this.uploadPassthrough}><img alt="Upload Skin" draggable={false} src={UploadIcon}></img></button>
					<button title="Change Gun" onMouseLeave={this.resetContext} onMouseEnter={() => this.setContext('change')} onClick={this.toggleGunSelector}><img alt="Change Gun" draggable={false} src={SwitchIcon}></img></button>
					<button title="Settings" onMouseLeave={this.resetContext} onMouseEnter={() => this.setContext('settings')} onClick={this.toggleSettings}><img alt="Settings" draggable={false} src={SettingsIcon}></img></button>
					<button title="View Source" onMouseLeave={this.resetContext} onMouseEnter={() => this.setContext('source')} onClick={() => window.location.href = githubLink}><img alt="View Source" draggable={false} src={CodeIcon}></img></button>
				</div>
				{!this.state.gunSelectorShown || <GunSelector selectGun={this.selectGun}/>}
				<Settings closeSettings={this.toggleSettings} eventBind={this.settingChanged} hidden={!this.state.settingsShown} />
				<div className="info-indicator">
					<p>{this.state.userUploaded ? 'User Content' : 'System Default'}</p>
					<p>{gunMappings[this.currentGun]}</p>
				</div>
			</div>
		</>;
	}
}

export default App;
