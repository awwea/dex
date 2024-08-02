import { FC } from 'react';
import { NewTabLink } from 'libs/routing';
import { ReactComponent as LogoCarbonDeFi } from 'assets/logos/logo.svg';

export const Footer: FC = () => {
  return (
    <footer className="border-background-800 mb-80 flex items-center border-t bg-black px-20 py-24 md:mb-0">
      <NewTabLink
        to="https://daofinance.me"
        aria-label="Powered By Carbon DeFi"
        className="text-14 font-weight-700 flex items-center gap-1 whitespace-nowrap text-white"
      >
        Copyright © {new Date().getFullYear()}. Powered by
        <LogoCarbonDeFi className="w-[100px] text-white" />
      </NewTabLink>
    </footer>
  );
};
