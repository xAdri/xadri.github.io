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
