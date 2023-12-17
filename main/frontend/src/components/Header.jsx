import { memo } from 'react';

const Header = memo(function Header() {
  return (
    <header className="mb-8 sm:mb-10 pb-8 sm:pb-14 space-y-14 sm:space-y-20 border-b border-slate-300">
      <nav className="font-semibold text-sm lg:text-xl">Logo</nav>
      <div className="space-y-3 sm:space-y-5">
        <h2 className="font-semibold text-lg lg:text-3xl">Page Title</h2>
        <p className="text-xs md:text-sm lg:text-base">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam
          malesuada bibendum arcu vitae elementum curabitur vitae nunc.
          Ultricies integer quis auctor elit sed vulputate. Blandit volutpat
          maecenas volutpat blandit aliquam.
        </p>
      </div>
    </header>
  );
});

export default Header;
