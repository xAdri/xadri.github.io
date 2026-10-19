const waitForMedia = (media) => {
  if (media instanceof HTMLImageElement) {
    if (media.complete) return Promise.resolve();
    return new Promise((resolve) => {
      media.addEventListener('load', resolve, { once: true });
      media.addEventListener('error', resolve, { once: true });
    });
  }

  if (media instanceof HTMLVideoElement) {
    if (media.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return Promise.resolve();
    return new Promise((resolve) => {
      media.addEventListener('loadeddata', resolve, { once: true });
      media.addEventListener('error', resolve, { once: true });
    });
  }

  return Promise.resolve();
};

document.querySelectorAll('.project, .about-gallery-item').forEach((item) => {
  const media = item.querySelector('img, video');
  waitForMedia(media).then(() => item.classList.add('is-loaded'));
});

requestAnimationFrame(() => {
  document.querySelectorAll('.about-copy, .resume').forEach((content) => content.classList.add('is-loaded'));
});

document.querySelectorAll('[data-language-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    const switchingToSpanish = button.dataset.currentLanguage === 'en';

    button.dataset.currentLanguage = switchingToSpanish ? 'es' : 'en';
    button.querySelector('[aria-hidden="true"]').textContent = switchingToSpanish ? '🇪🇳' : '🇪🇸';
    button.setAttribute('aria-label', switchingToSpanish ? 'Switch to English' : 'Cambiar a español');
    button.title = switchingToSpanish ? 'English' : 'Español';
  });
});

const lightboxTriggers = document.querySelectorAll('[data-media-lightbox]');

if (lightboxTriggers.length) {
  const lightbox = document.createElement('dialog');
  lightbox.className = 'media-lightbox';
  lightbox.setAttribute('aria-label', 'Expanded project media');
  lightbox.innerHTML = '<div class="media-lightbox-stage"><img class="media-lightbox-image" alt=""><button class="media-lightbox-close" type="button" aria-label="Close expanded media">&times;</button><button class="media-lightbox-arrow media-lightbox-arrow--previous" type="button" aria-label="View previous project media"></button><button class="media-lightbox-arrow media-lightbox-arrow--next" type="button" aria-label="View next project media"></button></div>';
  document.body.append(lightbox);

  const triggers = Array.from(lightboxTriggers);
  const lightboxImage = lightbox.querySelector('.media-lightbox-image');
  const closeButton = lightbox.querySelector('.media-lightbox-close');
  const previousButton = lightbox.querySelector('.media-lightbox-arrow--previous');
  const nextButton = lightbox.querySelector('.media-lightbox-arrow--next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  let currentIndex = 0;

  lightbox.classList.toggle('has-single-media', triggers.length < 2);

  const fitLightboxMedia = () => {
    if (!lightboxImage.naturalWidth || !lightboxImage.naturalHeight) return;

    const isMobileViewport = coarsePointer.matches || window.innerWidth <= 768;
    const isPortraitViewport = window.innerHeight >= window.innerWidth;
    const usesThumbControls = isMobileViewport && isPortraitViewport;
    const horizontalMargin = usesThumbControls ? 24 : isMobileViewport ? 136 : 176;
    const maxWidth = Math.max(160, window.innerWidth - horizontalMargin);
    const maxHeight = Math.max(160, isMobileViewport
      ? window.innerHeight - (usesThumbControls ? 88 : 24)
      : window.innerHeight * .82);
    const aspectRatio = lightboxImage.naturalWidth / lightboxImage.naturalHeight;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    lightbox.classList.toggle('uses-thumb-controls', usesThumbControls);
    lightboxImage.style.width = `${Math.round(width)}px`;
    lightboxImage.style.height = `${Math.round(height)}px`;
  };

  const showMedia = (index) => {
    const nextIndex = Math.min(Math.max(index, 0), triggers.length - 1);
    if (lightbox.open && nextIndex === currentIndex) return;

    currentIndex = nextIndex;
    const sourceImage = triggers[currentIndex].querySelector('img');
    if (!sourceImage) return;

    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === triggers.length - 1;
    lightboxImage.style.removeProperty('width');
    lightboxImage.style.removeProperty('height');
    lightboxImage.src = sourceImage.currentSrc || sourceImage.src;
    lightboxImage.alt = sourceImage.alt;
    lightboxImage.classList.remove('is-changing');
    void lightboxImage.offsetWidth;
    lightboxImage.classList.add('is-changing');
  };

  const closeLightbox = () => {
    if (!lightbox.open || lightbox.classList.contains('is-closing')) return;

    if (reducedMotion.matches) {
      lightbox.close();
      return;
    }

    lightbox.classList.add('is-closing');
    window.setTimeout(() => lightbox.close(), 220);
  };

  triggers.forEach((trigger, index) => {
    trigger.addEventListener('click', () => {
      showMedia(index);
      lightbox.classList.remove('is-closing');
      lightbox.showModal();
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  previousButton.addEventListener('click', () => showMedia(currentIndex - 1));
  nextButton.addEventListener('click', () => showMedia(currentIndex + 1));
  lightboxImage.addEventListener('load', fitLightboxMedia);
  window.addEventListener('resize', () => {
    if (lightbox.open) fitLightboxMedia();
  });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showMedia(currentIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showMedia(currentIndex + 1);
    }
  });
  lightbox.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeLightbox();
  });
  lightbox.addEventListener('close', () => {
    lightbox.classList.remove('is-closing');
    lightboxImage.classList.remove('is-changing');
    lightboxImage.removeAttribute('src');
    lightboxImage.style.removeProperty('width');
    lightboxImage.style.removeProperty('height');
    lightboxImage.alt = '';
  });
}
