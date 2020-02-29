import React from 'react';

import { NavBar } from '../../components/NavBar';
import { Hero } from 'react-bulma-components/full';


export default function StockPredictor() {
    return (
        <div>
            <Hero color="black" style={{height: '90px'}}>
                <Hero.Head>
                    <NavBar />
                </Hero.Head>
            </Hero>
        </div>
    );
}
