// trilha-modal.ts - Client-side Trilha Detail Modal controller
import { isTrilhaFavorite, toggleTrilhaFavorite, getNextLessonToWatchForTrilha, getAllLocalProgress } from '../lib/progress';
import { showToast } from '../lib/toast';

function getLoadedTrilhas(): any[] {
  try {
    const payload = document.getElementById('mindflix-trilhas-json');
    if (payload && payload.textContent) {
      return JSON.parse(payload.textContent);
    }
  } catch {}
  return [];
}

let allTrilhas: any[] = [];

function getModalEls() {
  return {
    backdrop: document.getElementById('trilha-detail-modal-backdrop'),
    closeBtn: document.getElementById('trilha-modal-close-btn'),
    favBtn: document.getElementById('modal-trilha-fav-btn'),
    playBtn: document.getElementById('modal-trilha-play-btn') as HTMLAnchorElement | null,
    playBtnText: document.getElementById('modal-trilha-play-btn-text'),
    nextHint: document.getElementById('modal-trilha-next-hint'),
    titleEl: document.getElementById('modal-trilha-title'),
    descEl: document.getElementById('modal-trilha-desc'),
    providerEl: document.getElementById('modal-trilha-provider'),
    coursesCountEl: document.getElementById('modal-trilha-courses-count'),
    lessonsCountEl: document.getElementById('modal-trilha-lessons-count'),
    durationEl: document.getElementById('modal-trilha-duration'),
    coverImg: document.getElementById('modal-trilha-cover-img') as HTMLImageElement | null,
    coverGrad: document.getElementById('modal-trilha-cover-gradient'),
    coursesList: document.getElementById('modal-trilha-courses-list'),
    progressCard: document.getElementById('modal-trilha-progress-card'),
    progressPct: document.getElementById('modal-trilha-progress-pct'),
    progressFill: document.getElementById('modal-trilha-progress-fill')
  };
}

let activeTrilhaId: string | null = null;

const hues = [
  'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
  'linear-gradient(135deg, #1f1c2c, #4a475a)',
  'linear-gradient(135deg, #141e30, #243b55)',
  'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
  'linear-gradient(135deg, #16222f, #1a365d)',
  'linear-gradient(135deg, #1a1c29, #2d3748)',
  'linear-gradient(135deg, #1e1b4b, #312e81)',
  'linear-gradient(135deg, #064e3b, #047857)',
  'linear-gradient(135deg, #4a0e2e, #831843)'
];

export function openTrilhaModal(trilhaId: string) {
  if (!allTrilhas || allTrilhas.length === 0) {
    allTrilhas = getLoadedTrilhas();
  }

  const els = getModalEls();
  let trilha = allTrilhas.find(t => t.id === trilhaId);
  if (!trilha) {
    allTrilhas = getLoadedTrilhas();
    trilha = allTrilhas.find(t => t.id === trilhaId);
  }
  if (!trilha || !els.backdrop) return;

  activeTrilhaId = trilha.id;

  // 1. Text & metadata
  if (els.titleEl) els.titleEl.textContent = trilha.title;
  if (els.descEl) els.descEl.textContent = trilha.description;
  if (els.providerEl) els.providerEl.textContent = trilha.provider || 'Formação Oficial';
  if (els.coursesCountEl) els.coursesCountEl.textContent = `${trilha.total_cursos} ${trilha.total_cursos === 1 ? 'Curso' : 'Cursos/Projetos'}`;
  if (els.lessonsCountEl) els.lessonsCountEl.textContent = `${trilha.total_lessons_count} Aulas`;
  if (els.durationEl) els.durationEl.textContent = trilha.total_duration_formatted || '';

  // 2. Cover / Gradient
  if (trilha.cover_image && els.coverImg) {
    els.coverImg.src = trilha.cover_image;
    els.coverImg.style.display = 'block';
    if (els.coverGrad) els.coverGrad.style.display = 'none';
  } else {
    if (els.coverImg) els.coverImg.style.display = 'none';
    if (els.coverGrad) {
      let hash = 0;
      for (let i = 0; i < trilha.id.length; i++) hash = trilha.id.charCodeAt(i) + ((hash << 5) - hash);
      els.coverGrad.style.background = hues[Math.abs(hash) % hues.length];
      els.coverGrad.style.display = 'block';
    }
  }

  // 3. Smart Next/Resume Lesson and Progress calculation
  const allProgress = getAllLocalProgress();
  const allLessons = trilha.allLessons || [];
  const nextWatch = getNextLessonToWatchForTrilha(trilha.id, allLessons);

  if (els.playBtn) {
    els.playBtn.href = nextWatch.watchUrl;
  }
  if (els.playBtnText) {
    els.playBtnText.textContent = nextWatch.label;
  }
  if (els.nextHint) {
    if (nextWatch.isResume && nextWatch.lesson) {
      els.nextHint.textContent = `Próximo: ${nextWatch.lesson.display_title}`;
    } else {
      els.nextHint.textContent = '';
    }
  }

  // Progress bar for trilha
  const totalLessons = trilha.total_lessons_count || allLessons.length;
  const completedCount = allLessons.filter((l: any) => allProgress[l.lesson?.id]?.completed).length;
  const pct = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;

  if (pct > 0 && els.progressCard) {
    els.progressCard.style.display = 'block';
    if (els.progressPct) els.progressPct.textContent = `${pct}% concluído (${completedCount}/${totalLessons} aulas)`;
    if (els.progressFill) els.progressFill.style.width = `${pct}%`;
  } else if (els.progressCard) {
    els.progressCard.style.display = 'none';
  }

  // 4. Favorite button state
  if (els.favBtn) {
    const isFav = isTrilhaFavorite(trilha.id);
    if (isFav) {
      els.favBtn.classList.add('active');
      els.favBtn.querySelector('.heart-icon')?.setAttribute('fill', 'currentColor');
    } else {
      els.favBtn.classList.remove('active');
      els.favBtn.querySelector('.heart-icon')?.setAttribute('fill', 'none');
    }
  }

  // 5. Build Chronological Courses List
  if (els.coursesList) {
    els.coursesList.innerHTML = '';
    if (Array.isArray(trilha.courses)) {
      trilha.courses.forEach((c: any) => {
        const item = document.createElement('a');
        item.className = 'trilha-stage-item';

        // Find first uncompleted lesson of this specific course in the trilha
        const courseLessons = allLessons.filter((l: any) => l.courseId === c.course_id || (l.courseOrder === c.ordem));
        const uncompletedCourseLesson = courseLessons.find((l: any) => !allProgress[l.lesson?.id]?.completed);
        const targetLesson = uncompletedCourseLesson || courseLessons[0];
        const stageUrl = targetLesson ? `/watch/trilha/${trilha.id}/${targetLesson.lesson.id}` : `/watch/trilha/${trilha.id}/first`;
        
        item.href = stageUrl;

        const completedLessonsCount = courseLessons.filter((l: any) => allProgress[l.lesson?.id]?.completed).length;
        const isCourseDone = courseLessons.length > 0 && completedLessonsCount === courseLessons.length;

        item.innerHTML = `
          <span class="trilha-stage-num">${c.ordem}</span>
          ${c.cover_image ? `<img src="${c.cover_image}" alt="" class="trilha-stage-thumb" onerror="this.style.display='none'" />` : ''}
          <div class="trilha-stage-info">
            <div class="trilha-stage-top">
              <span class="trilha-stage-badge">${c.tipo || 'Etapa'}</span>
              <h4 class="trilha-stage-title">${c.course_title || c.nome_trilha}</h4>
            </div>
            <span class="trilha-stage-meta">${completedLessonsCount > 0 ? `${completedLessonsCount}/${courseLessons.length} concluídas • ` : ''}${c.modules_count || 1} módulos • ${c.lessons_count || 0} aulas ${c.total_duration_formatted ? `(${c.total_duration_formatted})` : ''}</span>
          </div>
          <div class="trilha-stage-action">
            <span>${isCourseDone ? 'Rever' : completedLessonsCount > 0 ? 'Continuar' : 'Acessar'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        `;

        els.coursesList.appendChild(item);
      });
    }
  }

  // 6. Open dialog
  els.backdrop.style.display = 'flex';
  requestAnimationFrame(() => {
    els.backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

export function closeTrilhaModal() {
  const els = getModalEls();
  if (!els.backdrop) return;
  els.backdrop.classList.remove('active');
  setTimeout(() => {
    if (els.backdrop) els.backdrop.style.display = 'none';
    document.body.style.overflow = '';
    activeTrilhaId = null;
  }, 250);
}

if (typeof window !== 'undefined') {
  (window as any).openTrilhaModal = openTrilhaModal;
  (window as any).closeTrilhaModal = closeTrilhaModal;
}

document.addEventListener('open-trilha-modal', (e: any) => {
  if (e.detail?.trilhaId) openTrilhaModal(e.detail.trilhaId);
});

function bindTrilhaModalEvents() {
  const els = getModalEls();
  els.closeBtn?.removeEventListener('click', closeTrilhaModal);
  els.closeBtn?.addEventListener('click', closeTrilhaModal);

  if (els.backdrop) {
    els.backdrop.onclick = (e) => {
      if (e.target === els.backdrop) closeTrilhaModal();
    };
  }

  if (els.favBtn) {
    els.favBtn.onclick = async (e) => {
      e.preventDefault();
      if (!activeTrilhaId) return;
      const isFav = await toggleTrilhaFavorite(activeTrilhaId);
      if (isFav) {
        els.favBtn?.classList.add('active');
        els.favBtn?.querySelector('.heart-icon')?.setAttribute('fill', 'currentColor');
        showToast('Trilha adicionada à Minha Lista', 'success');
      } else {
        els.favBtn?.classList.remove('active');
        els.favBtn?.querySelector('.heart-icon')?.setAttribute('fill', 'none');
        showToast('Trilha removida da Minha Lista', 'info');
      }

      const pageCardFav = document.querySelector(`[data-fav-id="${activeTrilhaId}"]`);
      if (pageCardFav) {
        if (isFav) {
          pageCardFav.classList.add('active');
          pageCardFav.querySelector('.heart-icon')?.setAttribute('fill', 'currentColor');
        } else {
          pageCardFav.classList.remove('active');
          pageCardFav.querySelector('.heart-icon')?.setAttribute('fill', 'none');
        }
      }
    };
  }
}

document.addEventListener('keydown', (e) => {
  const els = getModalEls();
  if (e.key === 'Escape' && els.backdrop?.classList.contains('active')) {
    closeTrilhaModal();
  }
});

// Global delegated click for all trilha cards
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (target.closest('[data-action="favorite"]')) return;
  if (target.closest('.modal-close-btn') || target.closest('#trilha-modal-close-btn')) return;
  if (target.closest('.modal-scroll-body') || target.closest('#trilha-modal-scroll-body')) return;

  const card = target.closest<HTMLElement>('.trilha-card, .trilha-card-wrapper');
  if (card) {
    const trilhaId = card.getAttribute('data-trilha-id') || card.closest('[data-trilha-id]')?.getAttribute('data-trilha-id');
    if (trilhaId) {
      e.preventDefault();
      openTrilhaModal(trilhaId);
    }
  }
});

document.addEventListener('astro:page-load', bindTrilhaModalEvents);
bindTrilhaModalEvents();
