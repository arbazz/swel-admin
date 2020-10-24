import React from 'react';
import { Column, Row } from 'simple-flexbox';
import { StyleSheet, css } from 'aphrodite';
import SidebarComponent from './components/sidebar/SidebarComponent';
import HeaderComponent from './components/header/HeaderComponent';
import ContentComponent from './components/content/ContentComponent';
import './App.css';
import {
    Banner,
    Album,
    Song,
    Artist,
    Video,
    Genre
} from '../src/screens/index';

const styles = StyleSheet.create({
    container: {
        height: '100%',
        minHeight: '100vh'
    },
    content: {
        marginTop: 54
    },
    mainBlock: {
        backgroundColor: '#F7F8FC',
        padding: 30
    }
});

class App extends React.Component {

    state = { selectedItem: 'Banner' };

    componentDidMount() {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }

    resize = () => this.forceUpdate();

    render() {
        const { selectedItem } = this.state;
        return (
            <Row className={css(styles.container)}>
                <SidebarComponent selectedItem={selectedItem} onChange={(selectedItem) => this.setState({ selectedItem })} />
                <Column flexGrow={1} className={css(styles.mainBlock)}>
                    <HeaderComponent title={selectedItem} />
                    <div className={css(styles.content)}>
                        {selectedItem === "Overview" && <ContentComponent />}
                        {selectedItem === "Banner" && <Banner />}
                        {selectedItem === "Album" && <Album />}
                        {selectedItem === "Song" && <Song />}
                        {selectedItem === "Artist" && <Artist />}
                        {selectedItem === "Video" && <Video />}
                        {selectedItem === "Genre" && <Genre />}
                    </div>
                </Column>
            </Row>
        );
    }
}

export default App;
