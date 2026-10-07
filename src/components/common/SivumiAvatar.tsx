import React, { useState } from 'react';
import { Heart } from 'lucide-react';

import sivumiAvatarPath from '../../assets/images/sivumi_companion_avatar_1791342256966.jpg';

const SIVUMI_AVATAR_PATH = sivumiAvatarPath;

interface SivumiAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatus?: boolean;
  className?: string;
}

export const SivumiAvatar: React.FC<SivumiAvatarProps> = ({
  size = 'md',
  showStatus = false,
  className = ''
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const statusSizeClasses = {
    sm: 'w-2 h-2 bottom-0 right-0',
    md: 'w-2.5 h-2.5 bottom-0 right-0',
    lg: 'w-3 h-3 bottom-0.5 right-0.5',
    xl: 'w-3.5 h-3.5 bottom-1 right-1'
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border border-[#EBE4DF] bg-[#FAF5F2] shadow-xs flex items-center justify-center`}
      >
        {!imageFailed ? (
          <img
            src={SIVUMI_AVATAR_PATH}
            alt="Sivumi Companion"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#FAF5F2] text-[#B5838D]">
            <Heart className="w-4 h-4 fill-[#B5838D]/20 stroke-[1.8]" />
          </div>
        )}
      </div>

      {showStatus && (
        <span
          className={`absolute ${statusSizeClasses[size]} rounded-full bg-emerald-500 ring-2 ring-white`}
          title="Sivumi is active"
        />
      )}
    </div>
  );
};
