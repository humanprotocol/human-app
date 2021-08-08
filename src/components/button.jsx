export const Button = ({
  title,
  bgColor,
  color,
  width,
  border,
  borderColor,
  className,
  clkFun,
  disabled,
}) => {
  return (
    <button
      className={`btn-custom ${className}`}
      onClick={clkFun}
      style={{
        color,
        backgroundColor: bgColor,
        border,
        borderColor,
        width,
      }}
      disabled={disabled}
    >
      {" "}
      {title}
    </button>
  );
};
