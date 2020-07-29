import React from 'react';
import './GunSelector.css';

type GunSelectorProps = {
    selectGun: (gunSelected: string) => void
}

class GunSelector extends React.PureComponent<GunSelectorProps> {
    guns = ['All','Assault'];

    render() {
        let gunList = [];

        for (const gun of this.guns) {
            gunList.push(<div className="gun-field" key={gun} onClick={() => this.props.selectGun(gun)}>
                <p>{gun}</p>
            </div>)
        };

        return <div className="gun-selector">
            {gunList}
        </div>
    }
}

export default GunSelector;