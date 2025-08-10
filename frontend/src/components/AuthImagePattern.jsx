const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-8 lg:p-12 auth-image-container auth-overflow-fix">
      <div className="max-w-md text-center auth-scale-responsive">
        <div className="grid grid-cols-3 gap-2 lg:gap-3 mb-6 lg:mb-8 auth-spacing-responsive">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-primary/10 ${
                i % 2 === 0 ? "animate-pulse" : ""
              } auth-image-responsive`}
            />
          ))}
        </div>
        <h2 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4 auth-title-responsive">{title}</h2>
        <p className="text-base-content/60 auth-text-responsive">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
