// L'endroit où placer le code du front-end.
(function () {
  const form = document.getElementById('ajout-form');
  if (!form) return;

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const postalRe = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/i;
  const statusEl = document.getElementById('form-status');

  const fields = [
    'nom', 'espece', 'race', 'age', 'description',
    'courriel', 'adresse', 'ville', 'cp'
  ];

  function setError(name, msg) {
    const span = document.querySelector(`.error[data-for="${name}"]`);
    if (span) span.textContent = msg;
  }

  function clearError(name) {
    const span = document.querySelector(`.error[data-for="${name}"]`);
    if (span) span.textContent = '';
  }

  function hasComma(value) {
    return value.includes(',');
  }

  function validate() {
    let ok = true;
    statusEl.textContent = '';
    statusEl.className = '';

    fields.forEach(clearError);

    const data = Object.fromEntries(new FormData(form).entries());

    // 1) Champs obligatoires
    for (const f of fields) {
      if (!data[f] || data[f].trim() === '') {
        setError(f, 'Champ obligatoire.');
        ok = false;
      }
    }

    // 2) Aucune virgule autorisée
    for (const [k, v] of Object.entries(data)) {
      if (hasComma(v || '')) {
        setError(k, 'Les virgules sont interdites.');
        ok = false;
      }
    }

    // 3) Longueur du nom
    const nom = data.nom?.trim() ?? '';
    if (nom.length < 3 || nom.length > 20) {
      setError('nom', 'Le nom doit contenir entre 3 et 20 caractères.');
      ok = false;
    }

    // 4) Âge numérique entre 0 et 30
    const age = parseInt(data.age, 10);
    if (Number.isNaN(age) || age < 0 || age > 30) {
      setError('age', 'Âge invalide (doit être entre 0 et 30).');
      ok = false;
    }

    // 5) Courriel valide
    if (!emailRe.test(data.courriel || '')) {
      setError('courriel', 'Courriel invalide.');
      ok = false;
    }

    // 6) Code postal canadien valide
    if (!postalRe.test(data.cp || '')) {
      setError('cp', 'Code postal canadien invalide (ex: H1A 2B3).');
      ok = false;
    }

    return ok;
  }

  // Empêcher l'envoi si invalide
  form.addEventListener('submit', (e) => {
    if (!validate()) {
      e.preventDefault();
      statusEl.textContent = 'Veuillez corriger les erreurs.';
      statusEl.className = 'error';
    } else {
      statusEl.textContent = 'Envoi en cours...';
      statusEl.className = 'ok';
    }
  });

  // Effacer l'erreur au fur et à mesure que l'utilisateur tape
  fields.forEach((f) => {
    const el = document.getElementById(f);
    if (el) {
      el.addEventListener('input', () => clearError(f));
    }
  });
})();
