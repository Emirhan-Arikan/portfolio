export function hasPlayedIntro(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem('introPlayed') === 'true';
}

export function setIntroPlayed(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem('introPlayed', 'true');
}
