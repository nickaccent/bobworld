import { create } from 'zustand';
import * as THREE from 'three';

export const useStore = create((set) => ({
  start: false,
  setStart: (start) => {
    set(() => ({
      start,
    }));
  },
  load: false,
  setLoad: (load) => {
    set(() => ({
      load,
    }));
  },
  loading: true,
  setLoading: (loading) => {
    set(() => ({
      loading,
    }));
  },
  w: 0,
  setW: (w) => {
    set(() => ({
      w,
    }));
  },
  d: 0,
  setD: (d) => {
    set(() => ({
      d,
    }));
  },
  showCursor: true,
  setShowCursor: (showCursor) => {
    set(() => ({
      showCursor,
    }));
  },
  pathFindingGrid: null,
  setPathFindingGrid: (pathFindingGrid) => {
    set(() => ({
      pathFindingGrid,
    }));
  },
  entityManager: null,
  addEntityManager: (entityManager) => {
    set(() => ({
      entityManager,
    }));
  },

  hashGrid: null,
  addHashGrid: (hashGrid) => {
    set(() => ({
      hashGrid,
    }));
  },
  soundManager: null,
  addSoundManager: (soundManager) => {
    set(() => ({
      soundManager,
    }));
  },
  buildType: null,
  setBuildType: (type) => {
    set(() => ({
      buildType: type,
    }));
  },
  bulldozerMode: null,
  setBulldozerMode: (bulldozer) => {
    set(() => ({
      bulldozerMode: bulldozer,
    }));
  },
  startPosition: new THREE.Vector3(),
  setStartPosition: (startPosition) => {
    set(() => ({
      startPosition,
    }));
  },
  placementMode: false,
  setPlacementMode: (placementMode) => {
    set(() => ({
      placementMode,
    }));
  },
  roadModels: [],
  setRoadModels: (roadModels) => {
    set(() => ({
      roadModels,
    }));
  },
  buildingModels: [],
  setBuildingModels: (buildingModels) => {
    set(() => ({
      buildingModels,
    }));
  },
  debug: false,
  setDebug: (debug) => {
    set(() => ({
      debug,
    }));
  },
  funds: 100.0,
  setFunds: (funds) => {
    set(() => ({
      funds,
    }));
  },
  taxRate: 20,
  selectedItem: null,
  setSelectedItem: (selectedItem) => {
    set(() => ({
      selectedItem,
    }));
  },
  showBuildingMenu: false,
  setShowBuildingMenu: (showBuildingMenu) => {
    set(() => ({
      showBuildingMenu,
    }));
  },
  showUtilityMenu: false,
  setShowUtilityMenu: (showUtilityMenu) => {
    set(() => ({
      showUtilityMenu,
    }));
  },
  newRoadsCount: 0,
  setNewRoadsCount: (newRoadsCount) => {
    set(() => ({
      newRoadsCount,
    }));
  },
  clockH: 0,
  setClockH: (clockH) => {
    set(() => ({
      clockH,
    }));
  },
  clockM: 0,
  setClockMTick: (clockM) => {
    set(() => ({
      clockM,
    }));
  },
  showSettings: false,
  setShowSettings: (showSettings) => {
    set(() => ({
      showSettings,
    }));
  },
  muteBgAudio: false,
  setMuteBgAudio: (muteBgAudio) => {
    set(() => ({
      muteBgAudio,
    }));
  },
  muteFxAudio: false,
  setMuteFxAudio: (muteFxAudio) => {
    set(() => ({
      muteFxAudio,
    }));
  },

  bgAudioLevel: 1,
  setBgAudioLevel: (bgAudioLevel) => {
    set(() => ({
      bgAudioLevel,
    }));
  },
  fxAudioLevel: 1,
  setFxAudioLevel: (fxAudioLevel) => {
    set(() => ({
      fxAudioLevel,
    }));
  },
  blueprintModel: null,
  setBlueprintModel: (blueprintModel) => {
    set(() => ({
      blueprintModel,
    }));
  },
  blueprintPosition: null,
  setBlueprintPosition: (blueprintPosition) => {
    set(() => ({
      blueprintPosition,
    }));
  },
}));
