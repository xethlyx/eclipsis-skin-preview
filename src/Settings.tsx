import React from 'react';
import './Settings.css';

import SettingsIcon from './icons/Settings.svg';
import CloseIcon from './icons/Close.svg';

type SettingsProps = {
    eventBind: (changed: string, newValue: any) => void,
    closeSettings: () => void,
    hidden: boolean
}

class Settings extends React.PureComponent<SettingsProps> {
    public settings: {[settingName: string]: any} = {
        movementSmoothing: true,
        panningLocked: true,
        showGrid: true,
        cameraZoomRate: 1
    };

    public prettyPrintVariable(variableName: string) {
        const separatedVariable = variableName.replace(/([A-Z])/g, ' $1').trim();
        
        return separatedVariable.charAt(0).toUpperCase() + separatedVariable.slice(1);
    }
    
    constructor(props: any) {
        super(props);

        Object.assign(this.settings, JSON.parse(localStorage.getItem('settings') || "{}"));
        
        // apply previous settings
        for (const settingName in this.settings) {
            this.props.eventBind(settingName, this.settings[settingName]);
        }
    }

    public updateSetting = (settingName: string, newValue: any) => {
        this.settings[settingName] = newValue;

        this.forceUpdate();
        this.props.eventBind(settingName, this.settings[settingName]);
        localStorage.setItem('settings', JSON.stringify(this.settings))
    }

    render() {
        let settingsDisplay = [];
        for (const settingName in this.settings) {
            const setting = this.settings[settingName];
            let modify = <></>;

            switch (typeof setting) {
                case 'boolean':
                    modify = <div onClick={() => this.updateSetting(settingName, !this.settings[settingName])}className={`modify boolean ${setting ? 'active' : ''}`}>
                        <div className="small-box"></div>
                    </div>
                    break;
                case 'number':
                    modify = <input type="number" onChange={event => this.updateSetting(settingName, Number(event.target.value))} value={setting} className="modify" />
                    break;
                default:
                    console.warn(`Input type ${typeof setting} for field ${settingName} is not supported.`);
            }

            settingsDisplay.push(<div className="setting-field" key={settingName}>
                <p>{this.prettyPrintVariable(settingName)}</p>
                {modify}
            </div>);
        }

        return <div className={`settings-container ${this.props.hidden ? 'hidden' : ''}`}>
            <div className="settings">
                <div className="settings-header">
                    <div className="img-container"><img src={SettingsIcon} draggable={false} alt="" /></div>
                    <p>Settings</p>
                    <div className="close-container img-container" onClick={this.props.closeSettings}><img src={CloseIcon} draggable={false} alt="Close" /></div>
                </div>
                <div className="settings-content">
                    {settingsDisplay}
                </div>
            </div>
        </div>
    }
}

export default Settings;