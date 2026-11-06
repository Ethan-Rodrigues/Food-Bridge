/**
 * FoodBridge — Stop Food Waste Platform
 * Core Application Logic 3.0 (Award-Winning Interactive Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMissionControlClock();
  initRadarHubSelector();
  initAnimatedCounters();
  initBeforeAfterComparison();
  initImpactCalculator();
  initCoverageChecker();
  initHowItWorksTabs();
  initStoryFilters();
  initAudioPillInteractions();
  initFaqAccordion();
  initRescueToast();
  initModalTriggers();
});

/* ================= 1. NAVBAR & NAVIGATION ================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightCurrentSection();
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    mobileNavItems.forEach(item => {
      item.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy active link tracking
  function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.menu-item').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ================= 2. LIVE MISSION CONTROL CLOCK ================= */
function initMissionControlClock() {
  const clockEl = document.getElementById('missionControlClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const utcStr = now.toTimeString().split(' ')[0] + ' UTC';
    clockEl.textContent = utcStr;
  }
  update();
  setInterval(update, 1000);
}

/* ================= 3. REGIONAL RADAR HUB SELECTOR ================= */
function initRadarHubSelector() {
  const hubDropdown = document.getElementById('hubSelector');
  const statusEl = document.getElementById('topLiveStatus');

  if (!hubDropdown) return;

  const hubMap = {
    nyc: "<strong>38 Active Food Rescues</strong> in progress across New York Metro",
    sf: "<strong>26 Active Food Rescues</strong> in progress across San Francisco & Oakland",
    chi: "<strong>31 Active Food Rescues</strong> in progress across Chicago Greater Area",
    ldn: "<strong>44 Active Food Rescues</strong> in progress across Greater London & Boroughs",
    atx: "<strong>19 Active Food Rescues</strong> in progress across Austin & Central Texas"
  };

  hubDropdown.addEventListener('change', (e) => {
    const text = hubMap[e.target.value];
    if (text && statusEl) {
      statusEl.innerHTML = text;
    }
  });
}

/* ================= 4. ANIMATED METRIC COUNTERS ================= */
function initAnimatedCounters() {
  const mealsEl = document.getElementById('heroMealsDelivered');
  const sheltersEl = document.getElementById('heroSheltersCount');

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        if (mealsEl) animateNumber(mealsEl, 2450890, 2000);
        if (sheltersEl) animateNumber(sheltersEl, 380, 1500);
      }
    });
  }, { threshold: 0.1 });

  const heroSec = document.getElementById('hero');
  if (heroSec) observer.observe(heroSec);

  function animateNumber(element, target, duration) {
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

    const timer = setInterval(() => {
      frame++;
      const progress = easeOutCubic(frame / totalFrames);
      const val = Math.round(target * progress);

      element.textContent = val.toLocaleString();

      if (frame >= totalFrames) {
        clearInterval(timer);
        element.textContent = target.toLocaleString();
      }
    }, frameRate);
  }
}

/* ================= 5. BEFORE & AFTER COMPARISON TOGGLE ================= */
function initBeforeAfterComparison() {
  const btnWithout = document.getElementById('btnShowWithout');
  const btnWith = document.getElementById('btnShowWith');
  const panelWithout = document.getElementById('panelWithout');
  const panelWith = document.getElementById('panelWith');

  if (!btnWithout || !btnWith) return;

  btnWithout.addEventListener('click', () => {
    btnWithout.classList.add('active');
    btnWith.classList.remove('active');
    panelWithout.classList.remove('hidden');
    panelWith.classList.add('hidden');
  });

  btnWith.addEventListener('click', () => {
    btnWith.classList.add('active');
    btnWithout.classList.remove('active');
    panelWith.classList.remove('hidden');
    panelWithout.classList.add('hidden');
  });
}

/* ================= 6. INTERACTIVE IMPACT CALCULATOR ================= */
function initImpactCalculator() {
  const slider = document.getElementById('calcSlider');
  const weightDisplay = document.getElementById('calcWeightNumber');
  const facilitySelect = document.getElementById('calcFacilityType');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const pledgeBtn = document.getElementById('pledgeSurplusBtn');
  const certBtn = document.getElementById('openCertificateBtn');

  const resMeals = document.getElementById('calcMealsResult');
  const resCo2 = document.getElementById('calcCo2Result');
  const resCars = document.getElementById('calcCarsResult');
  const resWater = document.getElementById('calcWaterResult');
  const resTax = document.getElementById('calcTaxResult');

  // Certificate fields
  const certRecipient = document.getElementById('certRecipient');
  const certMeals = document.getElementById('certMeals');
  const certCo2 = document.getElementById('certCo2');
  const certWater = document.getElementById('certWater');
  const certTax = document.getElementById('certTax');

  if (!slider) return;

  function calculate(weight) {
    if (weightDisplay) weightDisplay.textContent = weight.toLocaleString();

    const meals = Math.round(weight * 2); // 1kg ≈ 2 meals
    const co2Kg = Math.round(weight * 2.5); // 1kg saved ≈ 2.5kg CO2e avoided
    const cars = (co2Kg / 220).toFixed(1); // 1 car emits ~220kg CO2/month
    const waterLiters = Math.round(weight * 500); // 1kg food ≈ 500L lifecycle water
    const taxWriteOff = Math.round(weight * 6); // $6 standard charitable deduction per kg

    if (resMeals) resMeals.textContent = meals.toLocaleString();
    if (resCo2) resCo2.textContent = `${co2Kg.toLocaleString()} kg`;
    if (resCars) resCars.textContent = cars;
    if (resWater) resWater.textContent = `${waterLiters.toLocaleString()} L`;
    if (resTax) resTax.textContent = `$${taxWriteOff.toLocaleString()}`;

    // Update Certificate modal preview
    if (certMeals) certMeals.textContent = meals.toLocaleString();
    if (certCo2) certCo2.textContent = `${co2Kg.toLocaleString()} kg`;
    if (certWater) certWater.textContent = `${waterLiters.toLocaleString()} L`;
    if (certTax) certTax.textContent = `$${taxWriteOff.toLocaleString()}`;
    if (certRecipient && facilitySelect) {
      certRecipient.textContent = facilitySelect.options[facilitySelect.selectedIndex].text + ' Culinary Team';
    }
  }

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    calculate(val);

    presetBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.kg, 10) === val);
    });
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseInt(btn.dataset.kg, 10);
      slider.value = val;
      calculate(val);
    });
  });

  if (facilitySelect) {
    facilitySelect.addEventListener('change', () => {
      const defaults = {
        hotel: 250,
        restaurant: 75,
        wedding: 600,
        corporate: 200,
        bakery: 60,
        residential: 35
      };
      const defVal = defaults[facilitySelect.value] || 250;
      slider.value = defVal;
      calculate(defVal);
    });
  }

  if (pledgeBtn) {
    pledgeBtn.addEventListener('click', () => {
      openModal('donateModal');
      const portionsInput = document.getElementById('foodPortions');
      const catSelect = document.getElementById('donorCategory');

      const currentWeight = parseInt(slider.value, 10);
      if (portionsInput) portionsInput.value = currentWeight * 2;
      if (catSelect && facilitySelect) {
        catSelect.value = mapFacilityToDonorCategory(facilitySelect.value);
      }
    });
  }

  if (certBtn) {
    certBtn.addEventListener('click', () => {
      openModal('certificateModal');
    });
  }

  // Initial Calculation
  calculate(parseInt(slider.value, 10));
}

function mapFacilityToDonorCategory(val) {
  const map = {
    hotel: 'Hotel',
    restaurant: 'Restaurant',
    wedding: 'Event',
    corporate: 'Corporate',
    bakery: 'Bakery',
    residential: 'Restaurant'
  };
  return map[val] || 'Restaurant';
}

/* ================= 7. LIVE COVERAGE CHECKER ================= */
function initCoverageChecker() {
  window.checkCoverage = function(e) {
    e.preventDefault();
    const input = document.getElementById('coverageInput');
    const resultBox = document.getElementById('coverageResult');
    const cityName = document.getElementById('resCityName');

    if (!input || !resultBox) return;

    const query = input.value.trim();
    if (!query) return;

    if (cityName) cityName.textContent = query;
    resultBox.classList.remove('hidden');
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}

/* ================= 8. HOW IT WORKS TABS ================= */
function initHowItWorksTabs() {
  const tabDonor = document.getElementById('tabDonorBtn');
  const tabNgo = document.getElementById('tabNgoBtn');
  const donorPanels = document.getElementById('donorPanels');
  const ngoPanels = document.getElementById('ngoPanels');

  if (!tabDonor || !tabNgo) return;

  tabDonor.addEventListener('click', () => {
    tabDonor.classList.add('active');
    tabDonor.setAttribute('aria-selected', 'true');
    tabNgo.classList.remove('active');
    tabNgo.setAttribute('aria-selected', 'false');

    donorPanels.classList.remove('hidden');
    ngoPanels.classList.add('hidden');
  });

  tabNgo.addEventListener('click', () => {
    tabNgo.classList.add('active');
    tabNgo.setAttribute('aria-selected', 'true');
    tabDonor.classList.remove('active');
    tabDonor.setAttribute('aria-selected', 'false');

    ngoPanels.classList.remove('hidden');
    donorPanels.classList.add('hidden');
  });
}

/* ================= 9. COMMUNITY STORIES FILTER ================= */
function initStoryFilters() {
  const tabs = document.querySelectorAll('.cat-pill');
  const cards = document.querySelectorAll('.story-bubble-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 10. AUDIO PILL MICRO-INTERACTION ================= */
function initAudioPillInteractions() {
  const audioPills = document.querySelectorAll('.sbc-audio-pill');

  audioPills.forEach(pill => {
    let isPlaying = false;
    pill.addEventListener('click', () => {
      isPlaying = !isPlaying;
      const playIcon = pill.querySelector('.audio-play-icon');
      const label = pill.querySelector('.audio-label');

      if (isPlaying) {
        if (playIcon) playIcon.textContent = '⏸';
        if (label) label.textContent = 'Playing Audio Note...';
        pill.style.background = 'rgba(16, 185, 129, 0.25)';
      } else {
        if (playIcon) playIcon.textContent = '▶';
        if (label) label.textContent = 'Listen to Audio Note';
        pill.style.background = '';
      }
    });
  });
}

/* ================= 11. FAQ ACCORDION ================= */
function initFaqAccordion() {
  const faqBoxes = document.querySelectorAll('.faq-item-box');

  faqBoxes.forEach(box => {
    const trigger = box.querySelector('.faq-toggle-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const wasActive = box.classList.contains('active');

      faqBoxes.forEach(b => {
        b.classList.remove('active');
        const bBtn = b.querySelector('.faq-toggle-trigger');
        if (bBtn) bBtn.setAttribute('aria-expanded', 'false');
      });

      if (!wasActive) {
        box.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================= 12. LIVE RESCUE TICKER TOAST ================= */
function initRescueToast() {
  const toast = document.getElementById('rescueToast');
  const headline = document.getElementById('toastHeadline');
  const body = document.getElementById('toastBody');
  const timestamp = document.getElementById('toastTimestamp');
  const dismissBtn = document.getElementById('dismissToastBtn');

  if (!toast) return;

  const feeds = [
    {
      title: "Live Rescue in Progress",
      body: "45 Hot meals rescued from The Grand Promenade → Delivered to St. Jude Youth Shelter (2.4 km)",
      time: "Just now"
    },
    {
      title: "Rescue Completed",
      body: "80 Artisan baguettes & pastries from Le Petit Croissant → Delivered to Hope Haven Kitchen",
      time: "2 mins ago"
    },
    {
      title: "Cold-Chain En Route",
      body: "140 Banquet servings from Sapphire Banquets → Dispatched to Senior Harmony Shelter (4°C Insulated)",
      time: "5 mins ago"
    },
    {
      title: "Milestone Reached",
      body: "Olive Bistro just crossed 1,500 total meals rescued this month!",
      time: "9 mins ago"
    }
  ];

  let idx = 0;
  let isDismissed = false;

  setTimeout(() => {
    if (!isDismissed) advanceToast();
  }, 4000);

  setInterval(() => {
    if (!isDismissed) advanceToast();
  }, 9000);

  function advanceToast() {
    toast.classList.remove('visible');

    setTimeout(() => {
      const current = feeds[idx];
      if (headline) headline.textContent = current.title;
      if (body) body.textContent = current.body;
      if (timestamp) timestamp.textContent = current.time;

      toast.classList.add('visible');
      idx = (idx + 1) % feeds.length;
    }, 400);
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      toast.classList.remove('visible');
      isDismissed = true;
    });
  }
}

/* ================= 13. MODALS & MULTI-STEP DONATION WIZARD ================= */
function initModalTriggers() {
  bindClick('openDonateModalBtn', () => openModal('donateModal'));
  bindClick('heroDonateCta', () => openModal('donateModal'));
  bindClick('mobDonateBtn', () => openModal('donateModal'));

  bindClick('openNgoModalBtn', () => openModal('ngoModal'));
  bindClick('mobNgoBtn', () => openModal('ngoModal'));

  bindClick('mobVolBtn', () => openModal('volunteerModal'));

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-backdrop.open').forEach(modal => {
        closeModal(modal.id);
      });
    }
  });
}

function bindClick(id, handler) {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', handler);
}

window.openModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
};

window.closeModal = function(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
};

// Multi-step Wizard Navigation
window.nextWizStep = function(stepNum) {
  if (stepNum === 2) {
    const name = document.getElementById('donorName').value.trim();
    const phone = document.getElementById('donorPhone').value.trim();
    const address = document.getElementById('donorAddress').value.trim();

    if (!name || !phone || !address) {
      alert('Please fill in your Kitchen Name, Phone, and Address before continuing.');
      return;
    }
  }

  if (stepNum === 3) {
    const portions = document.getElementById('foodPortions').value;
    const hygiene = document.getElementById('hygieneAgreement').checked;

    if (!portions || portions <= 0) {
      alert('Please enter estimated food portions.');
      return;
    }
    if (!hygiene) {
      alert('Please confirm the food hygiene agreement.');
      return;
    }

    // Populate summary review card
    document.getElementById('sumName').textContent = document.getElementById('donorName').value;
    document.getElementById('sumCategory').textContent = document.getElementById('foodCategory').value;
    document.getElementById('sumPortions').textContent = `${portions} Portions (~${Math.round(portions / 2)} kg)`;
    document.getElementById('sumSlot').textContent = document.getElementById('pickupSlot').value;
    document.getElementById('sumImpact').textContent = `Feeds ~${portions} people • Offsets ~${Math.round(portions * 1.25)} kg CO2`;
  }

  for (let i = 1; i <= 3; i++) {
    const panel = document.getElementById(`wizPanel${i}`);
    const indicator = document.getElementById(`wizInd${i}`);
    if (panel) panel.classList.toggle('active', i === stepNum);
    if (indicator) indicator.classList.toggle('active', i === stepNum);
  }
};

// Submit Donation
window.submitDonation = function(e) {
  e.preventDefault();
  const form = document.getElementById('donationForm');
  const success = document.getElementById('donateSuccess');
  const trackId = document.getElementById('dynTrackingId');

  const randomCode = Math.floor(1000 + Math.random() * 9000);
  if (trackId) trackId.textContent = `FB-${randomCode}-EXP`;

  if (form) form.classList.add('hidden');
  if (success) success.classList.remove('hidden');
};

// Submit NGO Application
window.submitNgo = function(e) {
  e.preventDefault();
  const form = document.getElementById('ngoForm');
  const success = document.getElementById('ngoSuccess');
  if (form) form.classList.add('hidden');
  if (success) success.classList.remove('hidden');
};

// Submit Volunteer Application
window.submitVolunteer = function(e) {
  e.preventDefault();
  const form = document.getElementById('volunteerForm');
  const success = document.getElementById('volunteerSuccess');
  if (form) form.classList.add('hidden');
  if (success) success.classList.remove('hidden');
};

// Newsletter
window.handleNewsletter = function(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterInput');
  const feedback = document.getElementById('newsletterFeedback');

  if (input && feedback) {
    feedback.innerHTML = `<span style="color: #10b981; font-size: 0.8125rem; font-weight: 700; display: block; margin-top: 0.5rem;">✓ Thank you! You've joined the FoodBridge monthly impact briefing.</span>`;
    input.value = '';
  }
};
