const Loader = () => {
    return (
      <div className="flex justify-center items-center space-x-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="relative w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            <div
              className="absolute inset-0 bg-gray-300 rounded-full"
              style={{ animation: `dot-anim 2s ease-in-out infinite ${i * 0.3}s` }}
            ></div>
            <div
              className="absolute inset-0 border-2 border-gray-300 rounded-full"
              style={{ animation: `outline-anim 2s ease-in-out infinite ${i * 0.6}s` }}
            ></div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Loader;
  
  // Tailwind CSS animations (add these in global styles if needed)
  <style>
  {`
  @keyframes dot-anim {
    0% { transform: scale(1); }
    50% { transform: scale(0); }
    100% { transform: scale(1); }
  }
  
  @keyframes outline-anim {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(1); opacity: 0; }
  }
  `}
  </style>
  