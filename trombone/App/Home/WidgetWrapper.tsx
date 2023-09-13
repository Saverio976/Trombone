import React from 'react';
import HomeBackground from './HomeBackground';
import { Widgets } from './Widgets/Widgets';

export default function WidgetWrapper() {
    return (
        <HomeBackground pageIndex={2}>
            <Widgets />
        </HomeBackground>
    );
}
