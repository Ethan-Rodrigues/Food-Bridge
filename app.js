/**
 * FoodBridge — Stop Food Waste Platform
 * Core Interactive Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnimatedCounters();
  initImpactCalculator();
  initHowItWorksTabs();
  initStoryFilters();
  initFaqAccordion();
  initRescueToast();
  initRadarTime();
  initModalTriggers();
});

/* ================= 1. NAVBAR & NAVIGATION ================= */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  // Sticky Navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Mobile menu toggle
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenuBtn.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy: Highlight active section in navigation
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ================= 2. ANIMATED METRIC COUNTERS ================= */
function initAnimatedCounters() {
  const counters = [
    { id: 'counterMeals', target: 2450890, prefix: '', suffix: '+' },
    { id: 'counterCo2', target: 1225, prefix: '', suffix: ' MT' },
    { id: 'counterWater', target: 8600000, prefix: '', suffix: ' L' },
    { id: 'counterTime', target: 38, prefix: '< ', suffix: ' min' }
  ];

  let hasAnimated = false;
  const impactSection = document.getElementById('impact');

  if (!impactSection) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => animateSingleCounter(counter));
      }
    });
  }, { threshold: 0.2 });

  observer.observe(impactSection);

  function animateSingleCounter({ id, target, prefix, suffix }) {
    const el = document.getElementById(id);
    if (!el) return;

    const duration = 2000; // ms
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const easeOutQuad = t => t * (2 - t);

    const timer = setInterval(() => {
      frame++;
      const progress = easeOutQuad(frame / totalFrames);
      const current = Math.round(target * progress);

      el.textContent = `${prefix}${current.toLocaleString()}${suffix}`;

      if (frame === totalFrames) {
        clearInterval(timer);
        el.textContent = `${prefix}${target.toLocaleString()}${suffix}`;
      }
    }, frameDuration);
  }
}

/* ================= 3. INTERACTIVE IMPACT CALCULATOR ================= */
function initImpactCalculator() {
  const slider = document.getElementById('surplusSlider');
  const weightDisplay = document.getElementById('surplusWeightDisplay');
  const donorTypeSelect = document.getElementById('donorTypeSelect');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const pledgeBtn = document.getElementById('calcPledgeBtn');

  const resMeals = document.getElementById('resMeals');
  const resCo2 = document.getElementById('resCo2');
  const resTrees = document.getElementById('resTrees');
  const resWater = document.getElementById('resWater');
  const resTax = document.getElementById('resTax');

  if (!slider) return;

  function updateCalculator(weight) {
    if (weightDisplay) weightDisplay.textContent = weight.toLocaleString();

    // Calculations based on EPA & FAO food rescue averages
    const meals = Math.round(weight * 2); // 1kg ≈ 2 meals
    const co2Kg = Math.round(weight * 2.5); // 1kg saved ≈ 2.5kg CO2e avoided
    const trees = Math.max(1, Math.round(co2Kg / 22)); // 1 tree offsets ~22kg/yr
    const waterLiters = Math.round(weight * 500); // 1kg food ≈ 500L lifecycle water
    const taxValue = Math.round(weight * 6); // $6 estimated charitable fair-market value

    if (resMeals) resMeals.textContent = meals.toLocaleString();
    if (resCo2) resCo2.textContent = `${co2Kg.toLocaleString()} kg`;
    if (resTrees) resTrees.textContent = trees.toLocaleString();
    if (resWater) resWater.textContent = `${waterLiters.toLocaleString()} L`;
    if (resTax) resTax.textContent = `$${taxValue.toLocaleString()}`;
  }

  slider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    updateCalculator(val);

    // Update active preset button highlight
    presetBtns.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.weight, 10) === val);
    });
  });

  presetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const weight = parseInt(btn.dataset.weight, 10);
      slider.value = weight;
      updateCalculator(weight);
    });
  });

  if (donorTypeSelect) {
    donorTypeSelect.addEventListener('change', () => {
      // Small visual flourish or default adjustments based on type
      const mapDefaults = {
        restaurant: 80,
        hotel: 250,
        event: 600,
        corporate: 180,
        bakery: 70,
        household: 30
      };
      const def = mapDefaults[donorTypeSelect.value] || 250;
      slider.value = def;
      updateCalculator(def);
    });
  }

  // Pre-fill donation modal when user clicks "Pledge This Surplus Now"
  if (pledgeBtn) {
    pledgeBtn.addEventListener('click', () => {
      openModal('donateModal');
      const portionsInput = document.getElementById('foodPortions');
      const donorCategorySelect = document.getElementById('donorCategory');
      
      const currentWeight = parseInt(slider.value, 10);
      if (portionsInput) {
        portionsInput.value = currentWeight * 2;
      }
      if (donorCategorySelect && donorTypeSelect) {
        donorCategorySelect.value = capitalizeFirst(donorTypeSelect.value);
      }
    });
  }

  // Initial calculation
  updateCalculator(parseInt(slider.value, 10));
}

function capitalizeFirst(str) {
  if (!str) return 'Restaurant';
  const map = {
    restaurant: 'Restaurant',
    hotel: 'Hotel',
    event: 'Event',
    bakery: 'Bakery',
    corporate: 'Corporate',
    household: 'Household'
  };
  return map[str] || 'Restaurant';
}

/* ================= 4. HOW IT WORKS TABS ================= */
function initHowItWorksTabs() {
  const tabDonor = document.getElementById('tabDonor');
  const tabNgo = document.getElementById('tabNgo');
  const donorSteps = document.getElementById('donor-steps');
  const ngoSteps = document.getElementById('ngo-steps');

  if (!tabDonor || !tabNgo) return;

  tabDonor.addEventListener('click', () => {
    tabDonor.classList.add('active');
    tabDonor.setAttribute('aria-selected', 'true');
    tabNgo.classList.remove('active');
    tabNgo.setAttribute('aria-selected', 'false');

    donorSteps.classList.remove('hidden');
    donorSteps.classList.add('active');
    ngoSteps.classList.add('hidden');
    ngoSteps.classList.remove('active');
  });

  tabNgo.addEventListener('click', () => {
    tabNgo.classList.add('active');
    tabNgo.setAttribute('aria-selected', 'true');
    tabDonor.classList.remove('active');
    tabDonor.setAttribute('aria-selected', 'false');

    ngoSteps.classList.remove('hidden');
    ngoSteps.classList.add('active');
    donorSteps.classList.add('hidden');
    donorSteps.classList.remove('active');
  });
}

/* ================= 5. COMMUNITY STORIES FILTER ================= */
function initStoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const storyCards = document.querySelectorAll('.story-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      storyCards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ================= 6. FAQ ACCORDION ================= */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other FAQs for clean single-expand behavior
      faqItems.forEach(i => {
        i.classList.remove('active');
        const t = i.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ================= 7. LIVE RESCUE TICKER TOAST ================= */
function initRescueToast() {
  const toast = document.getElementById('rescueToast');
  const toastTitle = document.getElementById('toastTitle');
  const toastDesc = document.getElementById('toastDesc');
  const toastTime = document.getElementById('toastTime');
  const dismissBtn = document.getElementById('dismissToastBtn');

  if (!toast) return;

  const mockFeeds = [
    {
      title: "Live Rescue in Progress",
      desc: "45 Hot meals rescued from The Grand Promenade Hotel → Delivered to St. Jude Youth Shelter (2.4 km)",
      time: "Just now"
    },
    {
      title: "Rescue Complete",
      desc: "80 Artisan baguettes & pastries from Le Petit Croissant → Arrived at Hope Haven Kitchen",
      time: "3 mins ago"
    },
    {
      title: "Live Dispatch",
      desc: "140 Wedding dinner servings from Sapphire Banquets → En route to City Senior Center (4°C Insulated)",
      time: "6 mins ago"
    },
    {
      title: "Community Milestone",
      desc: "Olive Bistro just crossed 1,500 total meals rescued this month!",
      time: "10 mins ago"
    }
  ];

  let currentIndex = 0;
  let isDismissed = false;

  // Show first toast after 3.5 seconds
  setTimeout(() => {
    if (!isDismissed) showNextToast();
  }, 3500);

  // Cycle every 9 seconds
  setInterval(() => {
    if (!isDismissed) showNextToast();
  }, 9000);

  function showNextToast() {
    toast.classList.remove('visible');

    setTimeout(() => {
      const feed = mockFeeds[currentIndex];
      if (toastTitle) toastTitle.textContent = feed.title;
      if (toastDesc) toastDesc.textContent = feed.desc;
      if (toastTime) toastTime.textContent = feed.time;

      toast.classList.add('visible');
      currentIndex = (currentIndex + 1) % mockFeeds.length;
    }, 400);
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      toast.classList.remove('visible');
      isDismissed = true;
    });
  }
}

/* ================= 8. RADAR TIME DISPLAY ================= */
function initRadarTime() {
  const timeEl = document.getElementById('liveTimeDisplay');
  if (!timeEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    timeEl.textContent = `LIVE • ${timeStr}`;
  }

  update();
  setInterval(update, 1000);
}

/* ================= 9. MODALS & MULTI-STEP DONATION WIZARD ================= */
function initModalTriggers() {
  // Bind all trigger buttons
  bindBtn('openDonateModalBtn', () => openModal('donateModal'));
  bindBtn('mobileDonateBtn', () => openModal('donateModal'));
  bindBtn('heroDonateBtn', () => openModal('donateModal'));
  bindBtn('howItWorksDonateBtn', () => openModal('donateModal'));
  bindBtn('ctaDonateBtn', () => openModal('donateModal'));

  bindBtn('openNgoModalBtn', () => openModal('ngoModal'));
  bindBtn('mobileNgoBtn', () => openModal('ngoModal'));
  bindBtn('ctaNgoBtn', () => openModal('ngoModal'));

  bindBtn('mobileVolunteerBtn', () => openModal('volunteerModal'));
  bindBtn('ctaVolunteerBtn', () => openModal('volunteerModal'));

  // Close modals when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
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

function bindBtn(id, handler) {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener('click', handler);
}

// Global modal helpers
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
window.goToWizardStep = function(stepNum) {
  // Validate Step 1 before proceeding to 2
  if (stepNum === 2) {
    const name = document.getElementById('donorName').value.trim();
    const phone = document.getElementById('donorPhone').value.trim();
    const address = document.getElementById('donorAddress').value.trim();

    if (!name || !phone || !address) {
      alert('Please fill in your Kitchen Name, Contact Phone, and Pickup Address before proceeding.');
      return;
    }
  }

  // Validate Step 2 before proceeding to 3
  if (stepNum === 3) {
    const portions = document.getElementById('foodPortions').value;
    const hygieneCheck = document.getElementById('hygieneCheck').checked;

    if (!portions || portions <= 0) {
      alert('Please enter estimated food portions.');
      return;
    }
    if (!hygieneCheck) {
      alert('Please check the food safety and hygiene certification box.');
      return;
    }

    // Populate Step 3 Summary
    const donorName = document.getElementById('donorName').value;
    const foodType = document.getElementById('foodType').value;
    const pickupWindow = document.getElementById('pickupWindow').value;

    document.getElementById('sumDonorName').textContent = donorName;
    document.getElementById('sumFoodType').textContent = foodType;
    document.getElementById('sumPortions').textContent = `${portions} Servings (~${Math.round(portions / 2)} kg)`;
    document.getElementById('sumPickup').textContent = pickupWindow;
    document.getElementById('sumImpactText').textContent = `Feeds ~${portions} people • Offsets ~${Math.round(portions * 1.25)} kg CO2`;
  }

  // Switch active panels
  for (let i = 1; i <= 3; i++) {
    const panel = document.getElementById(`wizStep${i}`);
    const indicator = document.getElementById(`wizStep${i}Indicator`);
    if (panel) panel.classList.toggle('active', i === stepNum);
    if (indicator) indicator.classList.toggle('active', i === stepNum);
  }
};

// Wizard Form Submission
window.handleDonationSubmit = function(e) {
  e.preventDefault();

  // Hide form panels & show success view
  const form = document.getElementById('donationForm');
  const successView = document.getElementById('donationSuccess');
  const trackingEl = document.getElementById('mockTrackingId');

  // Generate realistic dispatch tracking ID
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  if (trackingEl) trackingEl.textContent = `FB-${randomNum}-EXP`;

  if (form) form.classList.add('hidden');
  if (successView) successView.classList.remove('hidden');
};

// NGO Application Submission
window.handleNgoSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('ngoForm');
  const successView = document.getElementById('ngoSuccess');

  if (form) form.classList.add('hidden');
  if (successView) successView.classList.remove('hidden');
};

// Volunteer Application Submission
window.handleVolunteerSubmit = function(e) {
  e.preventDefault();
  const form = document.getElementById('volunteerForm');
  const successView = document.getElementById('volunteerSuccess');

  if (form) form.classList.add('hidden');
  if (successView) successView.classList.remove('hidden');
};

// Newsletter Subscription
window.handleNewsletter = function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('newsletterEmail');
  const feedback = document.getElementById('newsletterFeedback');

  if (emailInput && feedback) {
    feedback.innerHTML = `<span style="color: #10b981; font-size: 0.8125rem; font-weight: 600; display: block; margin-top: 0.35rem;">✓ Thank you! You've joined FoodBridge's monthly impact briefing.</span>`;
    emailInput.value = '';
  }
};
