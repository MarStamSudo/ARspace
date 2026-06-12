/*
  viewer.js — Φορτώνει τη scene από τη Supabase και την εμφανίζει
  
  Αυτό το αρχείο κάνει 3 πράγματα:
  1. Διαβάζει το scene_id από το URL
  2. Κατεβάζει τα δεδομένα (asset_url + scale) από τη Supabase
  3. Βάζει το .glb στο <model-viewer>
*/

/* ================================================================
   ΒΗΜΑ 1: Πάρε το scene_id από το URL
   
   Παράδειγμα URL: ar.arspace.io/v/abc-123-xyz
   
   window.location.pathname = "/v/abc-123-xyz"
   .split('/')                = ["", "v", "abc-123-xyz"]
   .pop()                     = "abc-123-xyz"   ← αυτό θέλουμε
   ================================================================ */
const sceneId = window.location.pathname.split('/').pop();

/* Αναφορές στα DOM elements που θα χρειαστούμε */
const modelViewer  = document.getElementById('ar-model');
const loadingEl    = document.getElementById('loading');
const errorEl      = document.getElementById('error-msg');
const titleEl      = document.getElementById('scene-title');

/* ================================================================
   ΒΗΜΑ 2: Αν δεν υπάρχει scene_id στο URL, δείξε error
   ================================================================ */
if (!sceneId) {
  showError('No scene ID found in URL.');
} else {
  loadScene(sceneId);
}

/* ================================================================
   loadScene: Κατεβάζει τα δεδομένα και στήνει το model-viewer
   ================================================================ */
async function loadScene(id) {
  try {
    /* ── Fetch από τη Supabase ──────────────────────────────────
       Ζητάμε από το objects table τις γραμμές όπου scene_id = id.
       
       Το "?scene_id=eq.{id}" είναι η σύνταξη του Supabase REST API
       για φίλτρο: "eq" = equals (ίσο με).
       
       Επίσης ζητάμε join με το scenes table για να πάρουμε και το name.
       Το "select=*,scenes(name)" λέει: "δώσε μου όλα τα πεδία του
       objects table, και από το scenes table μόνο το name".
    ── */
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/objects?scene_id=eq.${id}&select=*,scenes(name)`,
      {
        headers: {
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to load scene: ${response.status}`);
    }

    const rows = await response.json();

    /* Αν δεν βρέθηκε καμία γραμμή, η scene δεν υπάρχει */
    if (!rows || rows.length === 0) {
      throw new Error('Scene not found. The link may be invalid.');
    }

    const obj = rows[0]; /* Παίρνουμε τον πρώτο (και μοναδικό) object */

    /* ── ΒΗΜΑ 3: Στήσε το model-viewer ─────────────────────────
       Βάζουμε το asset_url ως src του model-viewer.
       Το model-viewer κατεβάζει αυτόματα το .glb και το εμφανίζει.
    ── */
    modelViewer.src = obj.asset_url;

    /*
      Scale: το model-viewer δέχεται scale ως string "x y z"
      (τρεις τιμές για τους 3 άξονες).
      Εμείς έχουμε ένα νούμερο (π.χ. 0.5), οπότε το εφαρμόζουμε
      και στους 3 άξονες: "0.5 0.5 0.5"
    */
    const s = obj.scale || 1;
    modelViewer.setAttribute('scale', `${s} ${s} ${s}`);

    /* Εμφάνισε το όνομα της scene αν υπάρχει */
    if (obj.scenes && obj.scenes.name) {
      titleEl.textContent = obj.scenes.name;
      titleEl.style.display = 'block';
    }

    /* Κρύψε το loading spinner */
    loadingEl.style.display = 'none';

  } catch (err) {
    showError(err.message);
  }
}

/* ================================================================
   showError: Εμφανίζει μήνυμα σφάλματος
   ================================================================ */
function showError(message) {
  loadingEl.style.display  = 'none';
  errorEl.style.display    = 'flex';
  errorEl.querySelector('.error-text').textContent = message;
}
