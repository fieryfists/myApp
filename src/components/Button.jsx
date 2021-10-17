import PropTypes from "prop-types";

const Button = ({ color, text, onCLick }) => {
  return (
    <button
      style={{ backgroundColor: color }}
      className="btn"
      onClick={onCLick}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  color: "steelBlue",
};

Button.prototype = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  onCLick: PropTypes.func.isRequired,
};

export default Button;
