import React from 'react';
import { getCategories } from '../../actions';
import { connect } from 'react-redux';

function CategoryItem({category}) {


    return (
        <tr>
            <td data-label="Nazwa"><a href={`/admin/kategorie/${category._id}`}>{category.name}</a></td>
            <td data-label="Akcje"><a href={`/admin/kategorie/${category._id}`}><button className="panel-button">EDYTUJ</button></a></td>
        </tr>
    )
}

function CategoriesTable({categories}) {
    return categories.map( category => <CategoryItem category={category} key={category._id}/>)
   }

class Categories extends React.Component {
    constructor(props) {
        super(props);
         this.state = {_id: '', name: ''}
    }
    async componentDidMount() {
       await this.props.getCategories();
    }
    render() {
        return(
            <div className="content-container">
            <div className="products-navigation-header">
                <a href={"/admin/kategorie/dodaj"}><button className="panel-button">+ dodaj kategorię</button></a>
                <div class="ui icon input">
                    <input type="text" placeholder="Szukaj..."/>
                    <i class="search icon"></i>
                </div>            </div>
            <div className="ui relaxed divided list"><table className="ui celled table">
            <thead>
            <tr><th>Nazwa</th>
            <th>Akcje</th>
            </tr></thead>
            <tbody>
            <CategoriesTable categories={this.props.categories}/>
            </tbody>
            </table>
            </div>            
            </div>
        )
    }
}

const mapStateToProps = state => {
    return { categories: state.categories };
};
export default connect(
    mapStateToProps,
    { getCategories }
)(Categories);