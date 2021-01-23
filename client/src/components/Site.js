import React from 'react';
import { connect } from 'react-redux';
import { getSite } from '../actions/index';
import ShopMenu from './ShopMenu';


class Site extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            content: '',
            error: ''
        }
    }

    componentDidMount = async () => {
        try {
            await this.props.getSite(this.props.match.params.id)
            this.setState({content: this.props.site.content})
        } catch(err) {
            this.setState({error: err.response.data})
        }
        let container = document.getElementById("content-container");
        container.innerHTML= this.state.content;
    }
    render() {
        return (
            <div className="shop-content"><ShopMenu/>
                <div className="site-container">  
        <h2>{this.props.site.name}</h2>          
            <div id="content-container"></div>
        </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { site: state.site };
};

export default connect(
    mapStateToProps,
    { getSite }
    )(Site);