import React from 'react';
import './GunColors.css';

type GunColorProps = {
	color: string;
	setColor: (color: string) => void;
	neon: boolean;
	setNeon: (value: boolean) => void;
	shading: boolean;
	setShading: (value: boolean) => void;
}

class GunColors extends React.PureComponent<GunColorProps> {
	colorRef = React.createRef<HTMLInputElement>();

	componentDidMount(): void {
		this.colorRef.current!.addEventListener('change', (event) => {
			this.props.setColor(this.colorRef.current!.value);
		})
	}

	render() {
		return <div className="gun-colors">
			<div className="elem">
				<label htmlFor="color">Team Color</label>
				<div className="box" onClick={() => this.colorRef.current?.click()}>
					<div className="fake-color" style={{ backgroundColor: this.props.color }}></div>
				</div>
				<input type="color" name="color" id="color" ref={this.colorRef} />
			</div>
			<div className="elem">
				<label htmlFor="neon">Neon</label>
				<div className={this.props.neon ? 'box active' : 'box'} onClick={() => this.props.setNeon(!this.props.neon)}>
					<div className="small-box"></div>
				</div>
			</div>
			<div className="elem">
				<label htmlFor="neon">Shading</label>
				<div className={this.props.shading ? 'box active' : 'box'} onClick={() => this.props.setShading(!this.props.shading)}>
					<div className="small-box"></div>
				</div>
			</div>
		</div>
	}
}

export default GunColors;