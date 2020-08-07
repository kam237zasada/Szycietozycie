import React from 'react';
import { getColors, deleteColor } from '../../actions';
import { connect } from 'react-redux';
import { getCookie } from '../../js/index';

class Colors extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            colors:[],
            renderSite: false,
            error: ''
        }
    }


    async componentDidMount() {
        const jwt = getCookie("jwt")
       await this.props.getColors(jwt);
       this.setState({colors: this.props.colors})
    }

    componentDidUpdate = async () => {
        if(this.state.renderSite) {

        }
    }

    handleDelete = async e => {
        e.preventDefault();
        const jwt = getCookie("jwt")
        try {
            await this.props.deleteColor(e.target.id, jwt);
            await this.props.getColors(jwt);
            this.setState({colors: this.props.colors})     

        } catch (err) {
            this.setState({error: err.response.data})
        }
    }

    renderColors() {
        return this.state.colors.map(color => {
            return (
            <tr>
                <td data-label="Nazwa"><a href={`/admin/colors/${color.ID}`}>{color.name}</a></td>
                <td data-label="Akcja"><button className="panel-button red" id={color._id} onClick={this.handleDelete}>USUŃ</button></td>
            </tr>
        )
        })
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/colors/add"}><button className="panel-button">+ dodaj kolor</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Nazwa</th>
            <th>Akcja</th>
            </tr></thead>
            <tbody>
                {this.renderColors()}
            </tbody>
            </table>
            <label className="error-message">{this.state.error}</label>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { colors: state.colors };
};
export default connect(
    mapStateToProps,
    { getColors, deleteColor }
)(Colors);