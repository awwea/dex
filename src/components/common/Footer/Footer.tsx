import { FC } from 'react';
import { NewTabLink } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/logo.svg';

export const Footer: FC = () => {
    return (
        <footer className="border-background-800 m-4 border-t bg-black md:mb-0">
            <div className="text-12 mx-auto w-full max-w-screen-xl p-16 py-8 font-medium md:flex md:items-center md:justify-between">
                <div className="flex items-center">
                    <NewTabLink
                        to="https://daofinance.me"
                        aria-label="by DFI"
                        className="flex items-center"
                    >
                        <LogoCarbonDeFi className="w-[80px]" />
                    </NewTabLink>
                    <span className="mx-4 block">⚜</span>
                    <span className="mt-2 block">
                        Copyright © 2020 - {new Date().getFullYear()}. All rights reserved.
                    </span>
                </div>
                <ul className="mt-4 flex flex-wrap items-center">
                    <li>Version: Alpha</li>
                </ul>
            </div>
        </footer>
    );
};
