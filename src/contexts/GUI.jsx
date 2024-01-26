import React, { createContext, useState, useMemo } from 'react';

export const GUIContext = createContext(null);

export function GUIContextProvider({ children }) {
  const [buildType, setBuildType] = useState(null);
  const [showBuildingMenu, setShowBuildingMenu] = useState(false);
  const [showUtilityMenu, setShowUtilityMenu] = useState(false);
  const [load, setLoad] = useState(false);
  const [start, setStart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [muteBgAudio, setMuteBgAudio] = useState(false);
  const [muteFxAudio, setMuteFxAudio] = useState(false);
  const [bgAudioLevel, setBgAudioLevel] = useState(false);
  const [fxAudioLevel, setFxAudioLevel] = useState(false);
  const [bulldozerMode, setBulldozerMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [canBuildBuilding, setCanBuildBuilding] = useState(false);
  const [newRoadsCount, setNewRoadsCount] = useState(0);
  const [funds, setFunds] = useState(0.0);
  const [placementMode, setPlacementMode] = useState(false);

  const GUIProviderValue = useMemo(
    () => ({
      buildType,
      setBuildType,
      showBuildingMenu,
      setShowBuildingMenu,
      showUtilityMenu,
      setShowUtilityMenu,
      load,
      setLoad,
      start,
      setStart,
      setLoading,
      loading,
      showSettings,
      setShowSettings,
      muteBgAudio,
      setMuteBgAudio,
      muteFxAudio,
      setMuteFxAudio,
      bgAudioLevel,
      setBgAudioLevel,
      fxAudioLevel,
      setFxAudioLevel,
      bulldozerMode,
      setBulldozerMode,
      selectedItem,
      setSelectedItem,
      canBuildBuilding,
      setCanBuildBuilding,
      newRoadsCount,
      setNewRoadsCount,
      funds,
      setFunds,
      placementMode,
      setPlacementMode,
    }),
    [
      buildType,
      setBuildType,
      showBuildingMenu,
      setShowBuildingMenu,
      showUtilityMenu,
      setShowUtilityMenu,
      load,
      setLoad,
      start,
      setStart,
      setLoading,
      loading,
      showSettings,
      setShowSettings,
      muteBgAudio,
      setMuteBgAudio,
      muteFxAudio,
      setMuteFxAudio,
      bgAudioLevel,
      setBgAudioLevel,
      fxAudioLevel,
      setFxAudioLevel,
      bulldozerMode,
      setBulldozerMode,
      selectedItem,
      setSelectedItem,
      canBuildBuilding,
      setCanBuildBuilding,
      newRoadsCount,
      setNewRoadsCount,
      funds,
      setFunds,
      placementMode,
      setPlacementMode,
    ],
  );

  return <GUIContext.Provider value={GUIProviderValue}>{children}</GUIContext.Provider>;
}
