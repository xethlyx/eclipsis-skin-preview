import React from 'react';
import * as THREE from 'three';
import { Object3D } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import './App.css';
import ContextMenu, { ContextMenuEntry } from './ContextMenu';
import GunColors from './GunColors';
import GunSelector from './GunSelector';
import Settings from './Settings';
import gunMappings from './gunMappings';
import CodeIcon from './icons/Code.svg';
import SettingsIcon from './icons/Settings.svg';
import SwitchIcon from './icons/Switch.svg';
import UploadIcon from './icons/Upload.svg';

const githubLink = 'https://github.com/xethlyx/eclipsis-skin-preview';

function loadImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = reject;
		img.src = src;
	});
}

class App extends React.PureComponent {
	state = {
		userUploaded: false,
		settingsShown: false,
		gunSelectorShown: false,

		contextName: '',
		contextMenu: [] as Array<ContextMenuEntry>,

		color: 'rgb(196, 40, 28)',
		neon: false,
		shading: true,
		fps: 0,
	};

	postProcessing = true;
	mounted = false;

	frameTimeTotal = 0;
	frameTotal = 0;

	private buttonContextMap: { [button: string]: Array<ContextMenuEntry> } = {
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
					window.location.reload();
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
		antialias: true,
	});
	private controls = new OrbitControls(this.camera, this.renderer.domElement);
	private composer = new EffectComposer(this.renderer);

	private currentSkin = '';
	private currentGun = 'Assault';

	private lastGunId: null | number = null;
	private oneTabPolicy = false;
	private autoCloseGunSelector = false;

	public gunMeshCache: { [gunId: string]: Object3D } = {};

	componentDidMount() {
		if (!this.mountRef.current) throw new Error('Mount point not found');

		this.mountRef.current.appendChild(this.renderer.domElement);
		this.mounted = true;

		// add stuff to the renderer
		const gridHelper = new THREE.GridHelper(
			100,
			100,
			new THREE.Color(0x7a7a7a),
			new THREE.Color(0x525252)
		);
		gridHelper.name = 'Grid';
		gridHelper.position.set(0, -0.75, 0);
		this.scene.add(gridHelper);

		const ambientLight = new THREE.AmbientLight(0xcccccc, 0.1)
		this.scene.add(ambientLight);

		const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.2);
		hemisphereLight.position.set(0, 10, 0);
		this.scene.add(hemisphereLight)

		const dirLight = new THREE.DirectionalLight(0xffffff, 2);
		dirLight.position.set(0, 1, 0);
		this.scene.add(dirLight)

		this.loadDefaultSkin();
	}

	componentDidUpdate(prevProps: Readonly<{}>, prevState: Readonly<{ neon: boolean, color: string, shading: boolean }>, snapshot?: any): void {
		if (prevState.neon !== this.state.neon || prevState.color !== this.state.color || prevState.shading !== this.state.shading) {
			this.loadWithTexture(this.currentSkin);
		}
	}

	componentWillUnmount(): void {
		this.mounted = false;
	}

	private loadDefaultSkin = async () => {
		const baseUrl = await this.toDataUrl(`texture.png`);
		this.currentSkin = baseUrl;
		this.loadWithTexture(this.currentSkin);
	}

	constructor(props: any) {
		super(props);

		this.scene.background = new THREE.Color(0x3A3A3A);
		this.camera.position.set(3, 2, 2);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.composer.setSize(window.innerWidth, window.innerHeight);

		const renderScene = new RenderPass(this.scene, this.camera);
		const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.15, 0.1, 0.5);
		const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
		const outputPass = new OutputPass();

		outputPass.renderToScreen = false;

		this.composer.addPass(renderScene);
		this.composer.addPass(bloomPass);
		this.composer.addPass(outputPass);
		this.composer.addPass(smaaPass);

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
			this.composer.setSize(window.innerWidth, window.innerHeight);
		});

		this.cacheGuns();

		let lastTime = 0;
		const animate = (now: number) => {
			const deltaTime = now - lastTime;
			lastTime = now;

			this.frameTimeTotal += deltaTime / 1000;
			this.frameTotal += 1;
			if (this.frameTimeTotal >= 1) {
				this.frameTimeTotal -= 1;
				if (this.mounted) this.setState({ fps: this.frameTotal });
				this.frameTotal = 0;
			}

			requestAnimationFrame(animate);
			this.controls.update();
			if (this.postProcessing) this.composer.render(deltaTime);
			else this.renderer.render(this.scene, this.camera);
		}
		animate(0);
	}

	private cacheGuns = () => {
		Object.keys(gunMappings).forEach(async gunName => {
			const loader = new OBJLoader();

			loader.load(
				`./weapons/${gunName}.obj`,
				mesh => {
					this.gunMeshCache[gunName] = mesh;
				}
			);
		});
	}

	public async toDataUrl(url: string) {
		const request = await fetch(url);
		if (request.status !== 200) {
			throw new Error('Could not retrieve data: non 200 status code');
		}

		const blob = await request.blob();

		return new Promise<string>(res => {
			const reader = new FileReader();
			reader.readAsDataURL(blob);
			reader.addEventListener('loadend', () => {
				res(reader.result as string);
			})
		});
	}

	private loadWithTexture = async (textureBase: string) => {
		const mesh = this.gunMeshCache[this.currentGun];

		if (!mesh) {
			console.warn(`Gun ${this.currentGun} not found! Is it still loading?`);
			return;
		}

		// making image load on update
		const image = await loadImage(textureBase);

		const diffuseCanvas = document.createElement('canvas');
		diffuseCanvas.width = image.width;
		diffuseCanvas.height = image.height;

		const diffuseContext = diffuseCanvas.getContext('2d')!;
		diffuseContext.save();
		diffuseContext.fillStyle = this.state.color;
		diffuseContext.fillRect(0, 0, diffuseCanvas.width, diffuseCanvas.height);
		diffuseContext.restore();
		diffuseContext.drawImage(image, 0, 0);

		const diffuseImage = await loadImage(diffuseCanvas.toDataURL());
		diffuseCanvas.remove();

		const diffuse = new THREE.Texture(diffuseImage);
		diffuse.colorSpace = THREE.SRGBColorSpace;

		const emissiveCanvas = document.createElement('canvas');
		emissiveCanvas.width = image.width;
		emissiveCanvas.height = image.height;

		const emissiveContext = emissiveCanvas.getContext('2d')!;
		emissiveContext.save();
		emissiveContext.fillStyle = '#ffffff';
		emissiveContext.fillRect(0, 0, emissiveCanvas.width, emissiveCanvas.height);
		emissiveContext.restore();
		emissiveContext.save();
		emissiveContext.globalCompositeOperation = 'destination-out';
		emissiveContext.drawImage(image, 0, 0);
		emissiveContext.restore();
		emissiveContext.save();
		emissiveContext.globalCompositeOperation = 'destination-over';
		emissiveContext.fillStyle = '#000000';
		emissiveContext.fillRect(0, 0, emissiveCanvas.width, emissiveCanvas.height);
		emissiveContext.restore();

		const emissiveImage = await loadImage(emissiveCanvas.toDataURL());
		emissiveCanvas.remove();

		const emissive = new THREE.Texture(emissiveImage);
		emissive.colorSpace = THREE.SRGBColorSpace;

		diffuse.needsUpdate = true;
		emissive.needsUpdate = true;

		const shader = this.state.shading ? new THREE.MeshStandardMaterial({
			color: 0xffffff,
			map: diffuse,
			emissiveMap: emissive,
			emissive: this.state.neon ? new THREE.Color(this.state.color) : new THREE.Color('#000000'),
			emissiveIntensity: this.state.neon ? 10 : 0,
		}) : new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: diffuse,
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

		switch (settingChanged) {
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
				if (grid) {
					grid.visible = newValue
				};
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
			case 'postProcessing':
				this.postProcessing = newValue;
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
				{!this.state.gunSelectorShown || <GunSelector selectGun={this.selectGun} />}
				<Settings closeSettings={this.toggleSettings} eventBind={this.settingChanged} hidden={!this.state.settingsShown} />
				<GunColors color={this.state.color} setColor={color => {
					this.setState({ color });
				}} neon={this.state.neon} setNeon={neon => {
					this.setState({ neon });
				}} shading={this.state.shading} setShading={shading => {
					this.setState({ shading });
				}} />
				<div className="info-indicator">
					<p>{this.state.userUploaded ? 'User Content' : 'System Default'} - {this.state.fps} FPS</p>
					<p>{gunMappings[this.currentGun]}</p>
				</div>
			</div>
		</>;
	}
}

export default App;
