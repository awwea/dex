import { FC } from 'react';
import { NewTabLink } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/logo.svg';

export const Footer: FC = () => {
  return (
    <footer className="border-background-800 mb-80 flex items-center border-t bg-black px-24 py-24 md:mb-0">
      <span className="text-14 font-weight-400 block">
        Copyright © 2020 - {new Date().getFullYear()}
      </span>
      <span className="mx-4 block">⚜</span>
      <NewTabLink
        to="https://daofinance.me"
        aria-label="by DFI"
        className="text-14 font-weight-400 flex items-center gap-1 whitespace-nowrap text-white"
      >
        <LogoCarbonDeFi className="w-[100px] text-white" />
      </NewTabLink>
    </footer>
  );
};
