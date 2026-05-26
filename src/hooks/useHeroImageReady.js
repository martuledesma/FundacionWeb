import { useEffect, useState } from 'react';

const useHeroImageReady = (imageUrl, waitingForContent = false) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (waitingForContent) {
      setIsReady(false);
      return undefined;
    }

    if (!imageUrl) {
      setIsReady(true);
      return undefined;
    }

    let active = true;
    const image = new Image();

    setIsReady(false);

    image.onload = () => {
      if (active) setIsReady(true);
    };

    image.onerror = () => {
      if (active) setIsReady(true);
    };

    image.src = imageUrl;

    return () => {
      active = false;
    };
  }, [imageUrl, waitingForContent]);

  return isReady;
};

export default useHeroImageReady;
