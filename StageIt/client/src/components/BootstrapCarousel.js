import React from 'react'
import Carousel from 'react-bootstrap/Carousel';

export const BootstrapCarousel = () => {
    return (
        <Carousel variant="dark">
            {/* randomize and display the carousel images from the static images */}
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={`Images/courosal_${Math.floor(Math.random() * 12) + 1}.jpg`} height={350}
                    alt="First slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={`Images/courosal_${Math.floor(Math.random() * 12) + 1}.jpg`} height={350}
                    alt="Second slide"
                />
            </Carousel.Item>
            <Carousel.Item>
                <img
                    className="d-block w-100"
                    src={`Images/courosal_${Math.floor(Math.random() * 12) + 1}.jpg`} height={350}
                    alt="Third slide"
                />
            </Carousel.Item>
        </Carousel>
    );
}