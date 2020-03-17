import React from 'react';
import Header from './Header';
import Footer from './Footer';

class AboutMe extends React.Component {

    render() {
        return(
            <div>
                <Header/>
                <div className="about-me-overall">
                <div className="about-me-container">
                    <div className="about-me-item">
                        <img className="about-me-image" src="./my-photo.jpg" alt="my-photo"/>
                        <p className="about-me-content">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum laoreet, dolor vitae facilisis porttitor, nulla arcu blandit justo, nec molestie diam lacus a est. Sed pharetra tincidunt massa, eget interdum augue. Suspendisse in gravida arcu. Nam at ipsum in massa commodo condimentum vitae ac enim. Donec sed aliquam urna, non scelerisque metus. Fusce at diam augue. Proin tempor suscipit justo at venenatis. Vivamus posuere blandit elit ac lobortis. Suspendisse nec mattis elit. Pellentesque eu metus nisl. Donec vel nisi vitae dui laoreet viverra a nec arcu. Aenean sollicitudin lectus dolor, semper interdum sem molestie nec. Nam sit amet faucibus ipsum. </p>
                    </div>
                </div>
                </div>
                <Footer/>
            </div>
        )
    }
}

export default AboutMe