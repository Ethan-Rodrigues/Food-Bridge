/**
 * FoodBridge — Stop Food Waste Platform
 * Dynamic Interactive Application Logic 2.0
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMissionClock();
  initHubCitySelector();
  initAnimatedCounters();
  initImpactCalculator();
  initCoverageChecker();
  initHowItWorksTabs();
  initStoryFilters();
  initFaqAccordion();
  initRescueToast();
  initModalTriggers();
});

/* ================= 1. NAVBAR & NAVIGATION ================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky Navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveNav();
  });

  // Mobile menu toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active section on scroll
  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 140;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-item').forEach(link => {
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
function initMissionClock() {
  const clockEl = document.getElementById('missionClock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const utcStr = now.toTimeString().split(' ')[0] + ' UTC';
    clockEl.textContent = utcStr;
  }
  update();
  setInterval(update, 1000);
}

/* ================= 3. REGIONAL HUB SWITCHER ================= */
function initHubCitySelector() {
  const hubSelect = document.getElementById('hubCitySelect');
  const headlineEl = document.getElementById('topTickerHeadline');

  if (!hubSelect) return;

  const hubData = {
    nyc: {
      headline: "<strong>38 Active Food Rescues</strong> in progress right now across New York Metro",
      city: "New York Metro"
    },
    sf: {
      headline: "<strong>26 Active Food Rescues</strong> in progress across San Francisco & Oakland",
      city: "San Francisco Bay"
    },
    chi: {
      headline: "<strong>31 Active Food Rescues</strong> in progress across Chicago Greater Area",
      city: "Chicago Greater"
    },
    ldn: {
      headline: "<strong>44 Active Food Rescues</strong> in progress across Greater London & Boroughs",
      city: "London Hub"
    },
    atx: {
      headline: "<strong>19 Active Food Rescues</strong> in progress across Austin & Central Texas",
      city: "Austin Central"
    }
  };

  hubSelect.addEventListener('change', (e) => {
    const selected = hubData[e.target.value];
    if (selected && headlineEl) {
      headlineEl.innerHTML = selected.headline;
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

  const heroSection = document.getElementById('hero');
  if (heroSection) observer.observe(heroSection);

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

/* ================= 5. INTERACTIVE IMPACT CALCULATOR ================= */
function initImpactCalculator() {
  const slider = document.getElementById('calcSlider');
  const weightDisplay = document.getElementById('calcWeightNumber');
  const facilitySelect = document.getElementById('calcFacilityType');
  const presetPills = document.querySelectorAll('.preset-pill');
  const pledgeBtn = document.getElementById('pledgeSurplusBtn');

  const resMeals = document.getElementById('calcMealsResult');
  const resCo2 = document.getElementById('calcCo2Result');
  const resCars = document.getElementById('calcCarsResult');
  const resWater = document.getElementById('calcWaterResult');
  const resTax = document.getElementById('calcTaxResult');

  if (!slider) return;

  function calculate(weight) {
    if (weightDisplay) weightDisplay.textContent = weight.toLocaleString();

    // Calculations based on EPA WARM model and UN FAO food rescue factors
    const meals = Math.round(weight * 2); // 1kg ≈ 2 meals
    const co2Kg = Math.round(weight * 2.5); // 1kg saved ≈ 2.5kg CO2e avoided
    const cars = (co2Kg / 220).toFixed(1); // 1 passenger car emits ~220kg CO2/month
    const waterLiters = Math.round(weight * 500); // 1kg food ≈ 500L lifecycle water
    const taxWriteOff = Math.round(weight * 6); // $6 standard charitable deduction per kg

    if (resMeals) resMeals.textContent = meals.toLocaleString();
    if (resCo2) resCo2.textContent = `${co2Kg.toLocaleString()} kg`;
    if (resCars) resCars.textContent = cars;
    if (resWater) resWater.textContent = `${waterLiters.toLocaleString()} L`;
    if (resTax) resTax.textContent = `$${taxWriteOff.toLocaleString()}`;
  }

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    calculate(val);

    presetPills.forEach(pill => {
      pill.classList.toggle('active', parseInt(pill.dataset.kg, 10) === val);
    });
  });

  presetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      presetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const val = parseInt(pill.dataset.kg, 10);
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
        catSelect.value = capitalizeFirst(facilitySelect.value);
      }
    });
  }

  // Initial Calculation
  calculate(parseInt(slider.value, 10));
}

function capitalizeFirst(val) {
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

/* ================= 6. LIVE COVERAGE CHECKER ================= */
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

    // Smooth scroll into focus
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };
}

/* ================= 7. HOW IT WORKS TABS ================= */
function initHowItWorksTabs() {
  const tabBtnDonor = document.getElementById('tabBtnDonor');
  const tabBtnNgo = document.getElementById('tabBtnNgo');
  const donorPanels = document.getElementById('donorPanels');
  const ngoPanels = document.getElementById('ngoPanels');

  if (!tabBtnDonor || !tabBtnNgo) return;

  tabBtnDonor.addEventListener('click', () => {
    tabBtnDonor.classList.add('active');
    tabBtnDonor.setAttribute('aria-selected', 'true');
    tabBtnNgo.classList.remove('active');
    tabBtnNgo.setAttribute('aria-selected', 'false');

    donorPanels.classList.remove('hidden');
    ngoPanels.classList.add('hidden');
  });

  tabBtnNgo.addEventListener('click', () => {
    tabBtnNgo.classList.add('active');
    tabBtnNgo.setAttribute('aria-selected', 'true');
    tabBtnDonor.classList.remove('active');
    tabBtnDonor.setAttribute('aria-selected', 'false');

    ngoPanels.classList.remove('hidden');
    donorPanels.classList.add('hidden');
  });
}

/* ================= 8. COMMUNITY STORIES FILTER ================= */
function initStoryFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.story-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;

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

/* ================= 9. FAQ ACCORDION ================= */
function initFaqAccordion() {
  const faqBoxes = document.querySelectorAll('.faq-box');

  faqBoxes.forEach(box => {
    const btn = box.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const wasActive = box.classList.contains('active');

      faqBoxes.forEach(b => {
        b.classList.remove('active');
        const bBtn = b.querySelector('.faq-question-btn');
        if (bBtn) bBtn.setAttribute('aria-expanded', 'false');
      });

      if (!wasActive) {
        box.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================= 10. LIVE RESCUE TICKER TOAST ================= */
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

  // Initial trigger
  setTimeout(() => {
    if (!isDismissed) advanceToast();
  }, 4000);

  // Cycle every 9 seconds
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

/* ================= 11. MODALS & MULTI-STEP DONATION WIZARD ================= */
function initModalTriggers() {
  // Bind CTA triggers
  bindClick('navDonateBtn', () => openModal('donateModal'));
  bindClick('heroPrimaryDonate', () => openModal('donateModal'));
  bindClick('mobileDrawerDonate', () => openModal('donateModal'));

  bindClick('navNgoBtn', () => openModal('ngoModal'));
  bindClick('mobileDrawerNgo', () => openModal('ngoModal'));

  bindClick('mobileDrawerVol', () => openModal('volunteerModal'));

  // Close when clicking outside
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal.id);
    });
  });

  // Close on Escape key
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

// Wizard Step Navigation
window.nextWizStep = function(stepNum) {
  if (stepNum === 2) {
    const name = document.getElementById('donorName').value.trim();
    const phone = document.getElementById('donorPhone').value.trim();
    const address = document.getElementById('donorAddress').value.trim();

    if (!name || !phone || !address) {
      alert('Please fill in your Organization Name, Phone, and Address before continuing.');
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

    // Populate summary
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

// Handle Donation Submit
window.submitDonation = function(e) {
  e.preventDefault();
  const form = document.getElementById('donationForm');
  const successView = document.getElementById('donateSuccess');
  const trackIdEl = document.getElementById('dynTrackingId');

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  if (trackIdEl) trackIdEl.textContent = `FB-${randomNum}-EXP`;

  if (form) form.classList.add('hidden');
  if (successView) successView.classList.remove('hidden');
};

// Handle NGO Submit
window.submitNgo = function(e) {
  e.preventDefault();
  const form = document.getElementById('ngoForm');
  const success = document.getElementById('ngoSuccess');
  if (form) form.classList.add('hidden');
  if (success) success.classList.remove('hidden');
};

// Handle Volunteer Submit
window.submitVolunteer = function(e) {
  e.preventDefault();
  const form = document.getElementById('volunteerForm');
  const success = document.getElementById('volunteerSuccess');
  if (form) form.classList.add('hidden');
  if (success) success.classList.remove('hidden');
};

// Handle Newsletter Submit
window.handleNewsletter = function(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterInput');
  const feedback = document.getElementById('newsletterFeedback');

  if (input && feedback) {
    feedback.innerHTML = `<span style="color: #10b981; font-size: 0.8125rem; font-weight: 700; display: block; margin-top: 0.5rem;">✓ Thank you! You've joined the FoodBridge monthly impact briefing.</span>`;
    input.value = '';
  }
};
