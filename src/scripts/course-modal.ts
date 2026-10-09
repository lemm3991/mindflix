// course-modal.ts - Client-side Course Detail Modal controller
import { getCourseCompletionStats, getNextLessonToWatch, isCourseFavorite, toggleFavorite, getAllLocalProgress } from '../lib/progress';
import { showToast } from '../lib/toast';

function getLoadedCourses(): any[] {
  try {
    const payload = document.getElementById('mindflix-courses-json');
    if (payload && payload.textContent) {
      return JSON.parse(payload.textContent);
    }
  } catch {}
  return [];
}

let allCourses = getLoadedCourses();

function getModalEls() {
  return {
    backdrop: document.getElementById('course-detail-modal-backdrop'),
    closeBtn: document.getElementById('modal-close-btn'),
    favBtn: document.getElementById('modal-fav-btn'),
    playBtn: document.getElementById('modal-play-btn') as HTMLAnchorElement | null,
    playBtnText: document.getElementById('modal-play-btn-text'),
    nextLessonHint: document.getElementById('modal-next-lesson-hint'),
    titleEl: document.getElementById('modal-course-title'),
    descEl: document.getElementById('modal-course-desc'),
    providerEl: document.getElementById('modal-provider'),
    modulesCountEl: document.getElementById('modal-modules-count'),
    lessonsCountEl: document.getElementById('modal-lessons-count'),
    tagsRow: document.getElementById('modal-tags-row'),
    coverImg: document.getElementById('modal-cover-img') as HTMLImageElement | null,
    coverGrad: document.getElementById('modal-cover-gradient'),
    modulesList: document.getElementById('modal-modules-list'),
    progressCard: document.getElementById('modal-progress-card'),
    progressPct: document.getElementById('modal-progress-pct'),
    progressFill: document.getElementById('modal-progress-fill')
  };
}

let activeCourseId: string | null = null;

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

export function openModal(courseId: string) {
  if (!allCourses || allCourses.length === 0) {
    allCourses = getLoadedCourses();
  }
  let course = allCourses.find(c => c.id === courseId || c.slug === courseId);
  if (!course) {
    allCourses = getLoadedCourses();
    course = allCourses.find(c => c.id === courseId || c.slug === courseId);
  }
  const els = getModalEls();
  if (!course || !els.backdrop) return;

  activeCourseId = course.id;

  // 1. Populate basic info
  if (els.titleEl) els.titleEl.textContent = course.display_title;
  if (els.descEl) els.descEl.textContent = course.description;
  if (els.providerEl) els.providerEl.textContent = course.provider;
  if (els.modulesCountEl) els.modulesCountEl.textContent = `${course.modules_count} ${course.modules_count === 1 ? 'Módulo' : 'Módulos'}`;
  if (els.lessonsCountEl) els.lessonsCountEl.textContent = `${course.lessons_count} ${course.lessons_count === 1 ? 'Aula' : 'Aulas'}`;

  // 2. Cover / Gradient
  if (course.cover_image && els.coverImg) {
    els.coverImg.src = course.cover_image;
    els.coverImg.style.display = 'block';
    if (els.coverGrad) els.coverGrad.style.display = 'none';
  } else {
    if (els.coverImg) els.coverImg.style.display = 'none';
    if (els.coverGrad) {
      let hash = 0;
      for (let i = 0; i < course.id.length; i++) hash = course.id.charCodeAt(i) + ((hash << 5) - hash);
      const gradient = hues[Math.abs(hash) % hues.length];
      els.coverGrad.style.background = gradient;
      els.coverGrad.style.display = 'block';
    }
  }

  // 3. Tags
  if (els.tagsRow) {
    els.tagsRow.innerHTML = '';
    course.tags?.forEach(t => {
      const span = document.createElement('span');
      span.className = 'modal-tag-pill';
      span.textContent = `#${t}`;
      els.tagsRow.appendChild(span);
    });
  }

  // 4. Progress Stats & Smart Resume Calculation
  const stats = getCourseCompletionStats(course.id, course.lessons_count);
  if (stats.percentage > 0) {
    if (els.progressCard) els.progressCard.style.display = 'block';
    if (els.progressPct) els.progressPct.textContent = `${stats.percentage}% concluído (${stats.completedCount}/${course.lessons_count} aulas)`;
    if (els.progressFill) els.progressFill.style.width = `${stats.percentage}%`;
  } else {
    if (els.progressCard) els.progressCard.style.display = 'none';
  }

  // Smart Next/Resume Lesson
  const nextWatch = getNextLessonToWatch(course);
  if (els.playBtn) {
    els.playBtn.href = nextWatch.watchUrl;
  }
  if (els.playBtnText) {
    els.playBtnText.textContent = nextWatch.label;
  }
  if (els.nextLessonHint) {
    if (nextWatch.isResume && nextWatch.lesson) {
      els.nextLessonHint.textContent = `Próximo: ${nextWatch.lesson.display_title}`;
    } else {
      els.nextLessonHint.textContent = '';
    }
  }

  // 5. Favorite button state
  if (els.favBtn) {
    const isFav = isCourseFavorite(course.id);
    if (isFav) {
      els.favBtn.classList.add('active');
      els.favBtn.querySelector('.heart-icon')?.setAttribute('fill', 'currentColor');
    } else {
      els.favBtn.classList.remove('active');
      els.favBtn.querySelector('.heart-icon')?.setAttribute('fill', 'none');
    }
  }

  // 6. Populate Curriculum Modules & Lessons
  if (els.modulesList) {
    els.modulesList.innerHTML = '';
    const allLocalProg = getAllLocalProgress();

    course.modules?.forEach((mod, modIdx) => {
      const modCard = document.createElement('div');
      modCard.className = `modal-module-card ${modIdx === 0 ? 'open' : ''}`;

      const completedLessonsInMod = mod.lessons?.filter(l => allLocalProg[l.id]?.completed).length || 0;

      modCard.innerHTML = `
        <div class="modal-module-header">
          <div class="modal-module-title-group">
            <span class="modal-module-num">${modIdx + 1}</span>
            <h4 class="modal-module-title">${mod.display_title}</h4>
          </div>
          <div class="modal-module-right">
            <span class="modal-module-count">${completedLessonsInMod > 0 ? `${completedLessonsInMod}/` : ''}${mod.lessons?.length || 0} aulas</span>
            <svg class="modal-module-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
        <div class="modal-lessons-list">
          ${(mod.lessons || []).map(lesson => {
            const isCompleted = Boolean(allLocalProg[lesson.id]?.completed);
            const lessonUrl = `/watch/${course.id}/${lesson.id}`;
            return `
              <a href="${lessonUrl}" class="modal-lesson-item ${isCompleted ? 'completed' : ''}">
                <div class="modal-lesson-left">
                  <svg class="modal-lesson-icon" width="16" height="16" viewBox="0 0 24 24" fill="${isCompleted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    ${isCompleted 
                      ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                      : '<polygon points="5 3 19 12 5 21 5 3"></polygon>'
                    }
                  </svg>
                  <span class="modal-lesson-title">${lesson.display_title}</span>
                </div>
                <div class="modal-lesson-right">
                  ${lesson.duration_formatted ? `<span class="modal-lesson-duration">${lesson.duration_formatted}</span>` : ''}
                  <svg class="modal-lesson-play-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </a>
            `;
          }).join('')}
        </div>
      `;

      // Toggle module accordion
      const header = modCard.querySelector('.modal-module-header');
      header?.addEventListener('click', () => {
        modCard.classList.toggle('open');
      });

      els.modulesList.appendChild(modCard);
    });
  }

  // 7. Open modal and lock scroll
  els.backdrop.style.display = 'flex';
  requestAnimationFrame(() => {
    if (els.backdrop) els.backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
}

export function closeModal() {
  const els = getModalEls();
  if (!els.backdrop) return;
  els.backdrop.classList.remove('active');
  setTimeout(() => {
    if (els.backdrop) els.backdrop.style.display = 'none';
    document.body.style.overflow = '';
    activeCourseId = null;
  }, 250);
}

// Attach globally to window
if (typeof window !== 'undefined') {
  (window as any).openCourseModal = openModal;
  (window as any).closeCourseModal = closeModal;
}

document.addEventListener('open-course-modal', (e: any) => {
  if (e.detail?.courseId) openModal(e.detail.courseId);
});

function bindCourseModalEvents() {
  const els = getModalEls();
  els.closeBtn?.removeEventListener('click', closeModal);
  els.closeBtn?.addEventListener('click', closeModal);

  if (els.backdrop) {
    els.backdrop.onclick = (e) => {
      if (e.target === els.backdrop) closeModal();
    };
  }

  if (els.favBtn) {
    els.favBtn.onclick = async (e) => {
      e.preventDefault();
      if (!activeCourseId) return;
      const isFav = await toggleFavorite(activeCourseId);
      if (isFav) {
        els.favBtn?.classList.add('active');
        els.favBtn?.querySelector('.heart-icon')?.setAttribute('fill', 'currentColor');
        showToast('Curso adicionado à Minha Lista', 'success');
      } else {
        els.favBtn?.classList.remove('active');
        els.favBtn?.querySelector('.heart-icon')?.setAttribute('fill', 'none');
        showToast('Curso removido da Minha Lista', 'info');
      }

      const pageCardFav = document.querySelector(`[data-fav-id="${activeCourseId}"]`);
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
    closeModal();
  }
});

// Global delegated click for all course cards
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  if (!target) return;
  if (target.closest('[data-action="favorite"]')) return;
  if (target.closest('.modal-close-btn') || target.closest('#modal-close-btn')) return;
  if (target.closest('.modal-scroll-body')) return;

  const card = target.closest<HTMLElement>('.course-card, .course-card-wrapper');
  if (card) {
    const courseId = card.getAttribute('data-course-id') || card.closest('[data-course-id]')?.getAttribute('data-course-id');
    if (courseId) {
      e.preventDefault();
      openModal(courseId);
    }
  }
});

document.addEventListener('astro:page-load', bindCourseModalEvents);
bindCourseModalEvents();
