import { memo } from 'react';
import PropTypes from 'prop-types';

const ChevronDown = memo(function ChevronDown({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
});

ChevronDown.propTypes = {
  className: PropTypes.string,
};

export default ChevronDown;
