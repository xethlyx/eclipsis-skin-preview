import React from 'react';
import './ContextMenu.css';

export type ContextMenuEntry = {
    name: string,
    callback: () => void
}

type ContextMenuProps = {
    reference: string,
    entries: Array<ContextMenuEntry>
}

class ContextMenu extends React.PureComponent<ContextMenuProps> {
    state = {
        shown: false,
        left: 0,
        top: 0
    }

    private contextRef = React.createRef<HTMLDivElement>();
    private cachedReference = '';
    private cachedEntries: Array<ContextMenuEntry> = [];

    private leftClick = (event: MouseEvent) => {
        event.preventDefault();

        this.setState({
            shown: false
        });

        document.removeEventListener('click', this.leftClick);
    }

    private rightClick = (event: MouseEvent) => {
        event.preventDefault();

        if (this.props.entries.length < 1) {
            if (this.state.shown) {
                this.setState({
                    shown: false
                });
            }

            return;
        };

        const contextMenu = this.contextRef.current;
        if (!contextMenu) return;

        this.cachedReference = this.props.reference;
        this.cachedEntries = this.props.entries;
        this.setState({
            shown: true,
            left: event.clientX,
            top: event.clientY
        }, () => {
            document.addEventListener('click', this.leftClick);
        });
    }

    componentDidMount() {
        // custom right click menu
		document.addEventListener('contextmenu', this.rightClick);
    }

    componentWillUnmount() {
        document.removeEventListener('contextmenu', this.rightClick);
    }
    
    render = () => {
        const entries = this.cachedEntries.map(entry => {
            return <p className="entry" key={entry.name} onClick={entry.callback}>
                {entry.name}
            </p>
        });

        return <div className={`context-menu ${this.state.shown ? '' : 'hidden'}`} ref={this.contextRef} style={{
            left: this.state.left + 10,
            top: this.state.top
        }}>
            <p className="header">{this.cachedReference}</p>
            {entries}
        </div>;
    };
}

export default ContextMenu;