import React from 'react';
import Header from './Header';
import NavigationBar from './NavigationBar';
import Content from './Content';

class AdminHomePage extends React.Component {

    render() {
        return (
            <div>
                <Header/>
                <div className="panel-content">
                <NavigationBar/>
                <Content/>
                </div>
            </div>
        )
    }
}
export default AdminHomePage