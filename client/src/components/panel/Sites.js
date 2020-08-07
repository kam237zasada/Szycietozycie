import React from 'react';
import { getSites } from '../../actions';
import { connect } from 'react-redux';


class Sites extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            sites:[],
            loaded: false
        }
    }
    async componentDidMount() {
       await this.props.getSites();
       this.setState({sites: this.props.sites})
       this.setState({loaded: true})
    }

    renderSites() {
        return this.state.sites.map(site => {
            
                return (
                    <tr>
                        <td data-label="Nazwa"><a href={`/admin/sites/edit/${site.ID}`}>{site.name}</a></td>
                        <td data-label="Typ">{site.category}</td>
                    </tr>
            )
            }
     
        )
    }
    render() {

        const renderTable = (
            <><div className="products-navigation-header">
                <a href={"/admin/sites/add"}><button className="panel-button">+ dodaj stronę</button></a>
                </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr>
                <th>Nazwa</th>
                <th>Kategoria</th>
            </tr></thead>
            <tbody>
            {this.renderSites()}
            </tbody>
            </table>
            </div></>
        )
        const loading = (
            <div>Wczytywanie...</div>
        )
        return(
            <div className="content-container">
                   {this.state.loaded ? renderTable : loading}    
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { sites: state.sites };
};
export default connect(
    mapStateToProps,
    { getSites }
)(Sites);