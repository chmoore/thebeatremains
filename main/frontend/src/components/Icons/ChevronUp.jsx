import { memo } from 'react';
import PropTypes from 'prop-types';

const ChevronUp = memo(function ChevronUp({ className, ...props }) {
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
        d="M4.5 15.75l7.5-7.5 7.5 7.5"
      />
    </svg>
  );
});

ChevronUp.propTypes = {
  className: PropTypes.string,
};

export default ChevronUp;
