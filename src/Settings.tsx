import preval from 'preval.macro';
import React from 'react';
import './Settings.css';
import CloseIcon from './icons/Close.svg';
import SettingsIcon from './icons/Settings.svg';

type SettingsProps = {
    eventBind: (changed: string, newValue: any) => void,
    closeSettings: () => void,
    hidden: boolean
}

class Settings extends React.PureComponent<SettingsProps> {
    public settings: {[settingName: string]: any} = {
        movementSmoothing: true,
        movementSmoothingFactor: 0.05,
        panningLocked: true,
        showGrid: true,
        oneTabPolicy: false,
        autoCloseGunSelector: false,
        cameraZoomRate: 1,
        backgroundColor: '3A3A3A',
        postProcessing: true,
    };

    public prettyPrintVariable(variableName: string) {
        const separatedVariable = variableName.replace(/([A-Z])/g, ' $1').replace(/_/g, '').trim();

        return separatedVariable.charAt(0).toUpperCase() + separatedVariable.slice(1);
    }

    constructor(props: any) {
        super(props);

        Object.assign(this.settings, JSON.parse(localStorage.getItem('settings') || "{}"));

        // apply previous settings
        for (const settingName in this.settings) {
            if (settingName.charAt(0) === '_') return;
            this.props.eventBind(settingName, this.settings[settingName]);
        }

        // add setting to bottom to know build time
        this.settings[`_buildTime`] = String(preval`module.exports = new Date().toLocaleString();`);
    }

    public updateSetting = (settingName: string, newValue: any) => {
        // readonly properties can't change!
        if (settingName.charAt(0) === '_') return;

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

            if (settingName.charAt(0) === '_') {
                // readonly property
                modify = <p>{setting}</p>
            } else {
                switch (typeof setting) {
                    case 'boolean':
                        modify = <div onClick={() => this.updateSetting(settingName, !this.settings[settingName])}className={`modify boolean ${setting ? 'active' : ''}`}>
                            <div className="small-box"></div>
                        </div>
                        break;
                    case 'number':
                        modify = <input type="number" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" onChange={event => this.updateSetting(settingName, Number(event.target.value))} value={setting} className="modify" />
                        break;
                    case 'string':
                        modify = <input type="text" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" onChange={event => this.updateSetting(settingName, event.target.value)} value={setting} className="modify" />
                        break;
                    default:
                        console.warn(`Input type ${typeof setting} for field ${settingName} is not supported.`);
                }
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