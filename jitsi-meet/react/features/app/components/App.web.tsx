import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GlobalStyles from '../../base/ui/components/GlobalStyles.web';
import JitsiThemeProvider from '../../base/ui/components/JitsiThemeProvider.web';
import DialogContainer from '../../base/ui/components/web/DialogContainer';
import ChromeExtensionBanner from '../../chrome-extension-banner/components/ChromeExtensionBanner.web';
import OverlayContainer from '../../overlay/components/web/OverlayContainer';

import { AbstractApp } from './AbstractApp';

// Register middlewares and reducers.
import '../middlewares';
import '../reducers';
import WelcomePageWeb from '../../welcome/components/WelcomePage.web';
import RegisterPage from '../../authentication/components/web/Register';
import LoginPage from '../../authentication/components/web/Login';
import SubscriptionPlans from '../../pricing/SubscriptionPlans';
import Navbar from './Navbar';


export class App extends AbstractApp {
    override _createExtraElement() {
        return (
            <JitsiThemeProvider>
                <OverlayContainer />
            </JitsiThemeProvider>
        );
    }

    override _createMainElement(component: React.ComponentType, props?: Object) {
        return (
            <JitsiThemeProvider>
                <GlobalStyles />
                <ChromeExtensionBanner />
                <Router>
                    
                    <Routes>
                        <Route path="/" element={<WelcomePageWeb />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path='/pricing' element={<SubscriptionPlans />} />
                        {/* Render lại giao diện chính của Jitsi */}
                        <Route path="*" element={super._createMainElement(component, props)} />
                    </Routes>
                </Router>
            </JitsiThemeProvider>
        );
    }

    override _renderDialogContainer() {
        return (
            <JitsiThemeProvider>
                <DialogContainer />
            </JitsiThemeProvider>
        );
    }
}
