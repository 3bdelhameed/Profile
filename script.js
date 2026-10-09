/**
 * Eng. Abdelhameed Elkhadrgy - Executive Telecom & Electronics Engineer Digital ID
 * Damietta, Egypt • NFC & QR Passport
 */

document.addEventListener('DOMContentLoaded', () => {
  // Engineer Profile Data
  const ENGINEER_DATA = {
    prefix: 'Eng.',
    firstName: 'Abdelhameed',
    lastName: 'Elkhadrgy',
    fullName: 'Eng. Abdelhameed Elkhadrgy',
    title: 'Electronics & Communication Engineer',
    organization: 'Telecommunications & Electronics Engineering',
    phone: '+201114236655',
    displayPhone: '01114236655',
    email: 'abdelhamedm775@gmail.com',
    city: 'Damietta',
    country: 'Egypt',
    location: 'Damietta, Egypt',
    whatsapp: 'https://wa.me/201114236655?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%20%D9%85%D9%87%D9%86%D8%AF%D8%B3%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%AD%D9%85%D9%8A%D8%AF',
    instagram: 'https://www.instagram.com/3bdelhameed_',
    facebook: 'https://www.facebook.com/3bdel7ameed',
    linkedin: 'https://linkedin.com/in/3bdelhameed'
  };

  // DOM Elements
  const themeToggle = document.getElementById('themeToggle');
  const qrBtn = document.getElementById('qrBtn');
  const shareBtn = document.getElementById('shareBtn');
  const saveContactBtn = document.getElementById('saveContactBtn');
  const copyPhonePill = document.getElementById('copyPhonePill');
  const qrModal = document.getElementById('qrModal');
  const closeQrModal = document.getElementById('closeQrModal');
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  const qrCodeContainer = document.getElementById('qrCodeContainer');
  const toastMessage = document.getElementById('toastMessage');

  let cachedPhotoBase64 = null;
  let qrCodeInstance = null;

  // Haptic feedback trigger for mobile devices
  function triggerHaptic(pattern = [20]) {
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignored
      }
    }
  }

  // ==========================================================================
  // 1. Theme Toggle Logic (Dark / Light) with Persistence
  // ==========================================================================
  const savedTheme = localStorage.getItem('engineer-card-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      triggerHaptic([15]);
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('engineer-card-theme', newTheme);
      showToast(newTheme === 'dark' ? '🌙 Executive Dark Mode' : '☀️ Titanium Light Mode');
    });
  }

  // ==========================================================================
  // 2. Preload & Compress Avatar for vCard Embedding
  // ==========================================================================
  preloadProfilePhoto();

  function preloadProfilePhoto() {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = 'assets/profile.png';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 240;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        cachedPhotoBase64 = dataUrl.split(',')[1];
      } catch (err) {
        console.warn('Could not cache avatar for vCard:', err);
      }
    };
  }

  // ==========================================================================
  // 3. vCard 3.0 Generation & Download (.vcf)
  // ==========================================================================
  function downloadVCard() {
    triggerHaptic([25, 40, 25]);

    let vCardLines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN;CHARSET=UTF-8:${ENGINEER_DATA.fullName}`,
      `N;CHARSET=UTF-8:${ENGINEER_DATA.lastName};${ENGINEER_DATA.firstName};;${ENGINEER_DATA.prefix};`,
      `TITLE;CHARSET=UTF-8:${ENGINEER_DATA.title}`,
      `ORG;CHARSET=UTF-8:${ENGINEER_DATA.organization}`,
      `TEL;TYPE=CELL,VOICE,PREF:${ENGINEER_DATA.phone}`,
      `TEL;TYPE=WORK,VOICE:${ENGINEER_DATA.phone}`,
      `EMAIL;TYPE=INTERNET,WORK:${ENGINEER_DATA.email}`,
      `ADR;TYPE=WORK;CHARSET=UTF-8:;;;${ENGINEER_DATA.city};;;${ENGINEER_DATA.country}`,
      `URL;TYPE=LinkedIn:${ENGINEER_DATA.linkedin}`,
      `URL;TYPE=Instagram:${ENGINEER_DATA.instagram}`,
      `URL;TYPE=Facebook:${ENGINEER_DATA.facebook}`,
      `X-SOCIALPROFILE;TYPE=linkedin:${ENGINEER_DATA.linkedin}`,
      `X-SOCIALPROFILE;TYPE=whatsapp:${ENGINEER_DATA.whatsapp}`,
      `X-SOCIALPROFILE;TYPE=instagram:${ENGINEER_DATA.instagram}`,
      `X-SOCIALPROFILE;TYPE=facebook:${ENGINEER_DATA.facebook}`,
      `NOTE;CHARSET=UTF-8:Electronics & Communication Engineer\\nBase: Damietta, Egypt\\nMobile: ${ENGINEER_DATA.displayPhone}\\nLinkedIn: ${ENGINEER_DATA.linkedin}\\nInstagram: @3bdelhameed_`
    ];

    if (cachedPhotoBase64) {
      vCardLines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${cachedPhotoBase64}`);
    }

    vCardLines.push('END:VCARD');

    const vCardContent = vCardLines.join('\r\n');
    const blob = new Blob([vCardContent], { type: 'text/vcard;charset=utf-8;' });
    const downloadUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `Eng_${ENGINEER_DATA.firstName}_${ENGINEER_DATA.lastName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);

    showToast('تم تحميل كارت الاتصال الهندسي! 👤⚡');
  }

  if (saveContactBtn) {
    saveContactBtn.addEventListener('click', downloadVCard);
  }

  // ==========================================================================
  // 4. Quick Copy Phone
  // ==========================================================================
  if (copyPhonePill) {
    copyPhonePill.addEventListener('click', () => {
      triggerHaptic([15]);
      copyToClipboard(ENGINEER_DATA.displayPhone, 'تم نسخ رقم الهاتف: 01114236655 📋');
    });
  }

  // ==========================================================================
  // 5. Native Share Sheet
  // ==========================================================================
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      triggerHaptic([15]);
      const shareUrl = window.location.href;
      if (navigator.share) {
        try {
          await navigator.share({
            title: ENGINEER_DATA.fullName,
            text: `${ENGINEER_DATA.fullName} • ${ENGINEER_DATA.title} (${ENGINEER_DATA.location})`,
            url: shareUrl
          });
        } catch (err) {
          if (err.name !== 'AbortError') {
            copyToClipboard(shareUrl, 'تم نسخ رابط الملف الشخصي! 🔗');
          }
        }
      } else {
        copyToClipboard(shareUrl, 'تم نسخ رابط الملف الشخصي! 🔗');
      }
    });
  }

  // ==========================================================================
  // 6. QR Code Modal
  // ==========================================================================
  if (qrBtn) {
    qrBtn.addEventListener('click', () => {
      triggerHaptic([15]);
      renderQrCode();
      qrModal.classList.add('active');
    });
  }

  if (closeQrModal) {
    closeQrModal.addEventListener('click', () => {
      triggerHaptic([10]);
      qrModal.classList.remove('active');
    });
  }

  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) {
        qrModal.classList.remove('active');
      }
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      triggerHaptic([15]);
      copyToClipboard(window.location.href, 'تم نسخ الرابط لمشاركته! 🔗');
    });
  }

  function renderQrCode() {
    const currentUrl = window.location.href;
    qrCodeContainer.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      qrCodeInstance = new QRCode(qrCodeContainer, {
        text: currentUrl,
        width: 170,
        height: 170,
        colorDark: '#070b14',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      const qrImg = document.createElement('img');
      qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${encodeURIComponent(currentUrl)}`;
      qrImg.alt = 'QR Code';
      qrCodeContainer.appendChild(qrImg);
    }
  }

  // ==========================================================================
  // 7. Clipboard Helper & Toast Alerts
  // ==========================================================================
  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg);
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMsg);
    } catch {
      showToast('تعذر النسخ تلقائياً');
    }
    document.body.removeChild(tempInput);
  }

  let toastTimer;
  function showToast(msg) {
    if (!toastMessage) return;
    toastMessage.textContent = msg;
    toastMessage.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 2800);
  }
});
