const Chevron = ({ color }: { color: string }) => {
  return (
    <svg
      stroke={color}
      fill="none"
      stroke-width="2"
      viewBox="0 0 24 24"
      strokeLinecap="round"
      stroke-linejoin="round"
      height="20px"
      width="20px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
};

export default Chevron;
