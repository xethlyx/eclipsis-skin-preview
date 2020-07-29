import React from 'react';
import './GunSelector.css';
import gunMappings from './gunMappings';

type GunSelectorProps = {
    selectGun: (gunSelected: string) => void
}

class GunSelector extends React.PureComponent<GunSelectorProps> {
    render() {
        let gunList = [];

        for (const gun of Object.keys(gunMappings)) {
            gunList.push(<div className="gun-field" key={gun} onClick={() => this.props.selectGun(gun)}>
                <p>{gunMappings[gun]}</p>
            </div>)
        };

        return <div className="gun-selector">
            {gunList}
        </div>
    }
}

export default GunSelector;