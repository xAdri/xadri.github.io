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

const projectItems = document.querySelectorAll('.project');
const caseStudyMediaItems = document.querySelectorAll('.case-study-media');
const mediaLoaderBlob = projectItems.length || caseStudyMediaItems.length
  ? fetch('assets/loading.gif')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load the media loader');
        return response.blob();
      })
      .catch(() => null)
  : Promise.resolve(null);

const loadMediaFrame = (frame, media) => {
  let loaderStartTimer;
  let individualLoaderUrl;

  mediaLoaderBlob.then((loaderBlob) => {
    if (!loaderBlob || !frame || frame.classList.contains('is-media-loaded')) return;

    const randomStartDelay = Math.random() * 1400;
    loaderStartTimer = window.setTimeout(() => {
      if (frame.classList.contains('is-media-loaded')) return;

      individualLoaderUrl = URL.createObjectURL(loaderBlob);
      frame.style.backgroundImage = `url("${individualLoaderUrl}")`;
    }, randomStartDelay);
  });

  waitForMedia(media).then(() => {
    window.clearTimeout(loaderStartTimer);
    frame?.classList.add('is-media-loaded');

    if (individualLoaderUrl) {
      window.setTimeout(() => {
        frame.style.removeProperty('background-image');
        URL.revokeObjectURL(individualLoaderUrl);
      }, 700);
    }
  });
};

projectItems.forEach((item) => {
  const media = item.querySelector('img, video');
  loadMediaFrame(media?.closest('.project-cover'), media);
});

caseStudyMediaItems.forEach((frame) => {
  loadMediaFrame(frame, frame.querySelector('img, video'));
});

document.querySelectorAll('.about-gallery-item').forEach((item) => {
  const media = item.querySelector('img, video');
  waitForMedia(media).then(() => item.classList.add('is-loaded'));
});

requestAnimationFrame(() => {
  projectItems.forEach((item) => item.classList.add('is-loaded'));
  document.querySelectorAll('.case-study > .case-study-section, .case-study > .case-study-topics, .case-study > .case-study-gallery, .case-study > .case-study-nav')
    .forEach((content) => content.classList.add('is-loaded'));
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
  lightbox.innerHTML = '<div class="media-lightbox-stage"><img class="media-lightbox-image media-lightbox-content" alt="" hidden><video class="media-lightbox-video media-lightbox-content" muted loop playsinline hidden></video><button class="media-lightbox-close" type="button" aria-label="Close expanded media"></button><button class="media-lightbox-arrow media-lightbox-arrow--previous" type="button" aria-label="View previous project media"></button><button class="media-lightbox-arrow media-lightbox-arrow--next" type="button" aria-label="View next project media"></button></div>';
  document.body.append(lightbox);

  const triggers = Array.from(lightboxTriggers);
  const lightboxImage = lightbox.querySelector('.media-lightbox-image');
  const lightboxVideo = lightbox.querySelector('.media-lightbox-video');
  const closeButton = lightbox.querySelector('.media-lightbox-close');
  const previousButton = lightbox.querySelector('.media-lightbox-arrow--previous');
  const nextButton = lightbox.querySelector('.media-lightbox-arrow--next');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentIndex = 0;
  let activeLightboxMedia = null;
  let mediaRequestId = 0;

  lightbox.classList.toggle('has-single-media', triggers.length < 2);

  const fitLightboxMedia = () => {
    if (!activeLightboxMedia) return;

    const mediaWidth = activeLightboxMedia instanceof HTMLVideoElement
      ? activeLightboxMedia.videoWidth
      : activeLightboxMedia.naturalWidth;
    const mediaHeight = activeLightboxMedia instanceof HTMLVideoElement
      ? activeLightboxMedia.videoHeight
      : activeLightboxMedia.naturalHeight;
    if (!mediaWidth || !mediaHeight) return;

    const isMobileViewport = Math.min(window.innerWidth, window.innerHeight) <= 600;
    const isPortraitViewport = window.innerHeight >= window.innerWidth;
    const usesThumbControls = isMobileViewport && isPortraitViewport;
    const horizontalMargin = usesThumbControls ? 24 : isMobileViewport ? 136 : 176;
    const maxWidth = Math.max(160, window.innerWidth - horizontalMargin);
    const maxHeight = Math.max(160, isMobileViewport
      ? window.innerHeight - (usesThumbControls ? 88 : 24)
      : window.innerHeight * .82);
    const aspectRatio = mediaWidth / mediaHeight;
    let width = maxWidth;
    let height = width / aspectRatio;

    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }

    lightbox.classList.toggle('uses-thumb-controls', usesThumbControls);
    activeLightboxMedia.style.width = `${Math.round(width)}px`;
    activeLightboxMedia.style.height = `${Math.round(height)}px`;
  };

  const revealMedia = (media, requestId) => {
    if (requestId !== mediaRequestId) return;

    activeLightboxMedia = media;
    media.hidden = false;
    fitLightboxMedia();
    lightbox.classList.remove('is-media-loading');
    media.classList.remove('is-changing');
    void media.offsetWidth;
    media.classList.add('is-changing');

    if (media instanceof HTMLVideoElement) {
      media.play().catch(() => {});
    }
  };

  const showMedia = (index) => {
    const nextIndex = Math.min(Math.max(index, 0), triggers.length - 1);
    if (lightbox.open && nextIndex === currentIndex) return;

    const sourceMedia = triggers[nextIndex].querySelector('img, video');
    if (!sourceMedia) return;

    currentIndex = nextIndex;
    const requestId = ++mediaRequestId;
    previousButton.disabled = currentIndex === 0;
    nextButton.disabled = currentIndex === triggers.length - 1;
    lightbox.classList.add('is-media-loading');
    activeLightboxMedia = null;

    lightboxImage.hidden = true;
    lightboxVideo.hidden = true;
    lightboxImage.classList.remove('is-changing');
    lightboxVideo.classList.remove('is-changing');
    lightboxImage.style.removeProperty('width');
    lightboxImage.style.removeProperty('height');
    lightboxVideo.style.removeProperty('width');
    lightboxVideo.style.removeProperty('height');
    lightboxImage.removeAttribute('src');
    lightboxImage.alt = '';
    lightboxVideo.pause();
    lightboxVideo.controls = false;
    lightboxVideo.removeAttribute('src');
    lightboxVideo.load();

    if (sourceMedia instanceof HTMLVideoElement) {
      const source = sourceMedia.currentSrc || sourceMedia.querySelector('source')?.src || sourceMedia.src;
      if (!source) return;

      lightboxVideo.controls = triggers[currentIndex].hasAttribute('data-video-controls');
      lightboxVideo.setAttribute('aria-label', sourceMedia.getAttribute('aria-label') || 'Expanded project video');
      lightboxVideo.addEventListener('loadedmetadata', () => revealMedia(lightboxVideo, requestId), { once: true });
      lightboxVideo.src = source;
      lightboxVideo.load();
    } else {
      lightboxImage.alt = sourceMedia.alt;
      lightboxImage.addEventListener('load', () => revealMedia(lightboxImage, requestId), { once: true });
      lightboxImage.src = sourceMedia.currentSrc || sourceMedia.src;
    }
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
    mediaRequestId += 1;
    lightbox.classList.remove('is-closing');
    lightbox.classList.remove('is-media-loading');
    lightboxImage.classList.remove('is-changing');
    lightboxVideo.classList.remove('is-changing');
    lightboxImage.removeAttribute('src');
    lightboxImage.style.removeProperty('width');
    lightboxImage.style.removeProperty('height');
    lightboxImage.alt = '';
    lightboxVideo.pause();
    lightboxVideo.controls = false;
    lightboxVideo.removeAttribute('src');
    lightboxVideo.removeAttribute('aria-label');
    lightboxVideo.style.removeProperty('width');
    lightboxVideo.style.removeProperty('height');
    lightboxVideo.load();
    lightboxVideo.hidden = true;
    lightboxImage.hidden = true;
    activeLightboxMedia = null;
  });
}
