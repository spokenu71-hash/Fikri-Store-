import React from "react";

export const Image = React.forwardRef(
  ({ src, alt = "", fittingType, ...props }, ref) => {
    if (!src) {
      return <img ref={ref} alt={alt} {...props} />;
    }
    return (
      <img ref={ref} src={src} alt={alt} loading="lazy" {...props} />
    );
  }
);
Image.displayName = "Image";
