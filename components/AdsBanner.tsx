import React, { useState } from 'react';
import { ExternalLink, ImageOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export type AdSize = 'leaderboard' | 'large-rectangle' | 'medium-rectangle' | 'banner' | 'mobile' | 'responsive' | 'sidebar';

interface AdsBannerProps {
  imageUrl?: string;
  destinationUrl?: string;
  size?: AdSize;
  className?: string;
  label?: string;
  onAdClick?: () => void;
  showLabel?: boolean;
  absolute?: boolean;
}

const AdsBanner: React.FC<AdsBannerProps> = ({
  imageUrl,
  destinationUrl,
  size = 'responsive',
  className = '',
  label = 'Advertisement',
  onAdClick,
  showLabel = true,
  absolute = false,
}) => {
  const { isPro } = useAuth();
  console.log("isPro:", isPro);

  // 🚀 Chỉ hiển thị ads nếu isPro === false
  // null: chưa có dữ liệu → không render
  // true: người dùng Pro → không render
  if (isPro === null || isPro === true) return null;

  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    'leaderboard': 'w-[728px] h-[90px]',
    'large-rectangle': 'w-[336px] h-[280px]',
    'medium-rectangle': 'w-[300px] h-[250px]',
    'banner': 'w-[468px] h-[60px]',
    'mobile': 'w-[320px] h-[50px]',
    'sidebar': 'w-full h-[600px]',
    'responsive': 'w-full h-auto aspect-[4/1] md:aspect-[8/1]',
  };

  const positionClasses = absolute
    ? "absolute inset-0 z-10 m-auto"
    : "relative mx-auto";

  const containerBaseClass = `overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-300 shadow-sm`;

  const handleClick = () => onAdClick?.();

  const Wrapper = destinationUrl ? 'a' : 'div';
  const wrapperProps = destinationUrl
    ? { href: destinationUrl, target: '_blank', rel: 'noopener noreferrer', onClick: handleClick }
    : { onClick: handleClick };

  return (
    <Wrapper
      {...wrapperProps}
      className={`${positionClasses} ${containerBaseClass} ${sizeClasses[size]} ${className} group ${destinationUrl ? 'cursor-pointer hover:opacity-95' : ''}`}
    >
      {showLabel && (
        <div className="absolute top-0 right-0 bg-neutral-200 dark:bg-neutral-700 text-[10px] text-neutral-500 dark:text-neutral-400 px-1.5 py-0.5 rounded-bl-md z-20 uppercase tracking-wider font-medium pointer-events-none">
          {label}
        </div>
      )}

      {imageUrl && !hasError ? (
        <>
          {!isLoaded && <div className="absolute inset-0 animate-pulse bg-neutral-200 dark:bg-neutral-700 z-0" />}
          <img
            src={imageUrl}
            alt={label}
            className={`w-full h-full object-cover transition-opacity duration-300 z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-400 dark:text-neutral-500 w-full h-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg m-1">
          {hasError ? (
            <ImageOff className="w-8 h-8 mb-2 opacity-50" />
          ) : (
            <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-2 opacity-50">
              <span className="font-bold text-lg">Ad</span>
            </div>
          )}
          <span className="text-sm font-medium">
            {hasError ? 'Ad Failed to Load' : 'Khi bạn thấy quảng cáo thật ở đây, có nghĩa là tui đang cần một ít cà phê để duy trì dịch vụ này 😅'}
          </span>
          {destinationUrl && (
            <span className="text-xs mt-1 flex items-center gap-1 opacity-70">
              Visit Site <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
      )}
    </Wrapper>
  );
};

export default AdsBanner;
