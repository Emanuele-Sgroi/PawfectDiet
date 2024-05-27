/*
  index.js (component barrel)
  ---------------------------
  Centralised re‑exports so screens can simply import from
  `src/components` instead of long relative paths.

  ✱  Keep ONE export‑per‑line – easier to diff / avoid merge conflicts
  ✱  Grouped loosely by feature so skimming is painless
*/

/* ---------- generic inputs & buttons ---------- */
export { default as InputWithIcon } from "./inputFields/InputWithIcon";
export { default as InputWithImage } from "./inputFields/InputWithImage";
export { default as InputPassword } from "./inputFields/InputPassword";
export { default as AutocompleteSearch } from "./inputFields/AutocompleteSearch";

export { default as ButtonLarge } from "./buttons/ButtonLarge";
export { default as ButtonGoogle } from "./buttons/ButtonGoogle";
export { default as ButtonBackAuth } from "./buttons/ButtonBackAuth";
export { default as AddMealButton } from "./buttons/AddMealButton";

/* ---------- common UI elements ---------- */
export { default as BasicLoadingModal } from "./Loading/BasicLoadingModal";
export { default as TitleOnlyNavbar } from "./navigationBars/TitleOnlyNavbar";
export { default as Dropdown } from "./dropDown/Dropdown";
export { default as Stopwatch } from "./stopWatch/Stopwatch";

/* ---------- auth / logout / info modals ---------- */
export { default as StandardInfoModal } from "./modals/StandardInfoModal";
export { default as CameraGallery } from "./modals/CameraGallery";
export { default as InfoModalTemoButton } from "./modals/InfoModalTemoButton";
export { default as LoggingOutModal } from "./modals/LoggingOutModal";
export { default as AddFoodModal } from "./modals/AddFoodModal";
export { default as AddTreatModal } from "./modals/AddTreatModal";
export { default as AddActivityModal } from "./modals/AddActivityModal";
export { default as AIFailsModal } from "./modals/AIFailsModal";

/* ---------- dog‑profile creation wizard ---------- */
export { default as ProfileCreationSteps } from "./dogProfileCreationComp/ProfileCreationSteps";
export { default as DogProfileCreationStep1 } from "./dogProfileCreationComp/DogProfileCreationStep1";
export { default as DogProfileCreationStep2 } from "./dogProfileCreationComp/DogProfileCreationStep2";
export { default as DogProfileCreationStep3 } from "./dogProfileCreationComp/DogProfileCreationStep3";
export { default as DogProfileCreationStep4 } from "./dogProfileCreationComp/DogProfileCreationStep4";

/* ---------- breed‑recognition workflow ---------- */
export { default as BreedRecognitionExamplesModal } from "./breedRecognitionComp/BreedRecognitionExamplesModal";
export { default as PhotoUploadComponent } from "./breedRecognitionComp/PhotoUploadComponent";
export { default as BreedAnalysisLoading } from "./breedRecognitionComp/BreedAnalysisLoading";

/* ---------- dashboard widgets ---------- */
export { default as TopNav } from "./dashboardComponents/TopNav";
export { default as CaloriesSummary } from "./dashboardComponents/CaloriesSummary";
export { default as QuickEntries } from "./dashboardComponents/QuickEntries";
export { default as WeigthMonitoring } from "./dashboardComponents/WeigthMonitoring"; // (sic: file name has original typo)
export { default as VetTips } from "./dashboardComponents/VetTips";
export { default as Discover } from "./dashboardComponents/Discover";
