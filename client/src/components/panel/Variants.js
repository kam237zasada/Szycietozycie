import React from 'react';
import { getVariants } from '../../actions';
import { connect } from 'react-redux';
import { getCookie } from '../../js/index';

class Variants extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            variants:[]
        }
    }


    async componentDidMount() {
        const jwt = getCookie("jwt")
       await this.props.getVariants(jwt);
       this.setState({variants: this.props.variants})
    }

    renderVariants() {
        return this.state.variants.map(variant => {
            return (
            <tr>
                <td data-label="Nazwa"><a href={`/admin/variants/${variant.ID}`}>{variant.name}</a></td>
            </tr>
        )
        })
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/variants/add"}><button className="panel-button">+ dodaj wariant</button></a>
                <div className="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i className="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Nazwa</th>
            </tr></thead>
            <tbody>
                {this.renderVariants()}
            </tbody>
            </table>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { variants: state.variants };
};
export default connect(
    mapStateToProps,
    { getVariants }
)(Variants);