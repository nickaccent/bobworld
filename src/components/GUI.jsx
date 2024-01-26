import React, { useContext } from 'react';
import { ClockContext } from '../contexts/Clock';
import { GUIContext } from '../contexts/GUI';
import { EntityManagerContext } from '../contexts/EntityManager';

const GUI = () => {
  const { clockH, clockM } = useContext(ClockContext);
  const {
    buildType,
    setBuildType,
    showBuildingMenu,
    setShowBuildingMenu,
    showUtilityMenu,
    setShowUtilityMenu,
    setLoad,
    setStart,
    setShowSettings,
    showSettings,
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
  } = useContext(GUIContext);

  const { entityManager } = useContext(EntityManagerContext);

  const muteBgAudioSet = () => {
    if (muteBgAudio === true) {
      entityManager?.soundManager.toggleMuteSound('bgmusic', false);
      setMuteBgAudio(false);
    } else {
      entityManager?.soundManager.toggleMuteSound('bgmusic', true);
      setMuteBgAudio(true);
    }
  };

  const changeBgMusicVolume = (level) => {
    entityManager?.soundManager.changeGainSound('bgmusic', level);
  };

  const muteFxAudioSet = () => {
    if (muteFxAudio === true) {
      entityManager?.soundManager.toggleMuteFx(false);
      setMuteFxAudio(false);
    } else {
      entityManager?.soundManager.toggleMuteFx(true);
      setMuteFxAudio(true);
    }
  };

  const changeFxMusicVolume = (level) => {
    entityManager?.soundManager.changeGainFx(level);
  };

  return (
    <>
      <div
        className={`${
          selectedItem === null ? 'd-hidden' : ''
        } glassmorphism infoPanel br-r-8 p-h c-primary`}
      >
        <div className="flex-column overflowY-scroll">
          <div className="col-12">
            <div className="header">
              <h3 className="mt-h mb-h">{selectedItem !== null && selectedItem.type}</h3>
              <span
                onClick={() => {
                  setSelectedItem(null);
                  entityManager.soundManager.playSound('fx_uiclick', false);
                }}
                className="topright cursor-pointer px-h py-h"
              >
                ×
              </span>
            </div>
          </div>
          <div className="col-12">
            <div className="body pt-1 overflowY-scroll">
              <p>ID: {selectedItem !== null && selectedItem.id}</p>
              <p>Building Level: {selectedItem !== null && selectedItem.buildingLevel}</p>
              {selectedItem !== null && selectedItem.type === 'residential' ? (
                <>
                  <p>Building Tenants: </p>
                  {selectedItem !== null && selectedItem.tenants.length > 0 ? (
                    <>
                      <ul className="list-unstyled overflowY-scroll">
                        {selectedItem.tenants.map((tenant) => {
                          let tennantObj = entityManager.getEntity(tenant);
                          let tennantJob = 'Unemployed';
                          if (tennantObj.job !== null) {
                            tennantJob = entityManager.getEntity(tennantObj.job).name;
                          }

                          return (
                            <li key={tennantObj.id}>
                              <p>ID: {tennantObj.id}</p>
                              <p>Name: {tennantObj.name}</p>
                              <p>Funds: £{tennantObj.funds}</p>
                              <p>Job: {tennantJob}</p>
                              <p>Visible: {tennantObj.visible === true ? 'Yes' : 'No'}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
              {selectedItem !== null && selectedItem.type === 'industrial' ? (
                <>
                  <p>Name: {selectedItem.name}</p>
                  <p>Current Funds: £{selectedItem !== null && selectedItem.current_funds}</p>
                  <p>
                    Shift:{' '}
                    {selectedItem.levelData.shift_startH > 0
                      ? selectedItem.levelData.shift_startH
                      : '00'}
                    :
                    {selectedItem.levelData.shift_startM > 0
                      ? selectedItem.levelData.shift_startM
                      : '00'}{' '}
                    -{' '}
                    {selectedItem.levelData.shift_endH > 0
                      ? selectedItem.levelData.shift_endH
                      : '00'}
                    :
                    {selectedItem.levelData.shift_endM > 0
                      ? selectedItem.levelData.shift_endM
                      : '00'}
                  </p>
                  <p>
                    Building Employees {selectedItem !== null && selectedItem.employees.length}/
                    {selectedItem !== null && selectedItem.maxEmployees}:{' '}
                  </p>
                  {selectedItem !== null && selectedItem.employees.length > 0 ? (
                    <>
                      <ul className="list-unstyled overflowY-scroll">
                        {selectedItem.employees.map((employee) => {
                          let employeeObj = entityManager.getEntity(employee);
                          return (
                            <li key={employeeObj.id}>
                              <p>{employeeObj.name}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    ''
                  )}
                  <p>Building Goods Stock: {selectedItem !== null && selectedItem.goods}</p>
                  <p>Building Scheduled Deliveries: </p>
                  {selectedItem !== null && selectedItem.deliveryBatches.length > 0 ? (
                    <>
                      <ul className="list-unstyled overflowY-scroll">
                        {selectedItem.deliveryBatches.map((delivery, index) => {
                          return (
                            <li key={index}>
                              <p>Goods: {delivery.goodsCount}</p>
                              <p>
                                Timeslot: {delivery.deliverySlotH}:{delivery.deliverySlotM}
                              </p>
                              <p>Destination ID: {delivery.destinationId}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
              {selectedItem !== null && selectedItem.type === 'commercial' ? (
                <>
                  <p>Name: {selectedItem.name}</p>
                  <p>Current Funds: £{selectedItem !== null && selectedItem.current_funds}</p>
                  <p>Building Goods Stock: {selectedItem?.stock}</p>
                  <p>
                    Shift:{' '}
                    {selectedItem.levelData.shift_startH > 0
                      ? selectedItem.levelData.shift_startH
                      : '00'}
                    :
                    {selectedItem.levelData.shift_startM > 0
                      ? selectedItem.levelData.shift_startM
                      : '00'}{' '}
                    -{' '}
                    {selectedItem.levelData.shift_endH > 0
                      ? selectedItem.levelData.shift_endH
                      : '00'}
                    :
                    {selectedItem.levelData.shift_endM > 0
                      ? selectedItem.levelData.shift_endM
                      : '00'}
                  </p>
                  <p>
                    Building Employees {selectedItem !== null && selectedItem.employees.length}/
                    {selectedItem !== null && selectedItem.maxEmployees}:{' '}
                  </p>
                  {selectedItem !== null && selectedItem.employees.length > 0 ? (
                    <>
                      <ul className="list-unstyled overflowY-scroll">
                        {selectedItem.employees.map((employee) => {
                          let employeeObj = entityManager.getEntity(employee);
                          return (
                            <li key={employeeObj.id}>
                              <p>{employeeObj.name}</p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="glassmorphism menu bt-r-8">
        <div className="flex">
          <div className="col-8">
            <div className="flex space-between">
              <div>
                <div className="flex">
                  <div className="hover">
                    <div className="flex-column pos-relative">
                      <img
                        src="./images/road.png"
                        onClick={() => {
                          setBulldozerMode(false);
                          setBuildType('road');
                          setSelectedItem(null);
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className="text-center small pos-absolute top-2 right-0">£5</div>
                      <div className={`selector ${buildType === 'road' ? 'selected' : ''}`}></div>
                    </div>
                  </div>
                  <div className="divider-h"></div>
                  <div className="hover">
                    <div className="flex-column">
                      <img
                        src="./images/zoning.png"
                        onClick={() => {
                          showBuildingMenu ? setShowBuildingMenu(false) : setShowBuildingMenu(true);
                          setShowUtilityMenu(false);
                          setBuildType(null);
                          setBulldozerMode(false);
                          setSelectedItem(null);
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className="selector"></div>
                    </div>
                  </div>
                  <div className={`building-sub-menu ${showBuildingMenu ? 'active' : ''}`}>
                    <div className="flex">
                      <div className="divider-h"></div>
                      <div className="hover">
                        <div className="flex-column">
                          <img
                            src="./images/zone-residential.png"
                            onClick={() => {
                              setBulldozerMode(false);
                              setBuildType('residential');
                              setSelectedItem(null);
                              entityManager.soundManager.playSound('fx_uiclick', false);
                            }}
                            title="Residential"
                          />
                          <div
                            className={`selector ${buildType === 'residential' ? 'selected' : ''}`}
                          ></div>
                        </div>
                      </div>
                      <div className="divider-h"></div>
                      <div className="hover">
                        <div className="flex-column">
                          <img
                            src="./images/zone-commercial.png"
                            onClick={() => {
                              setBulldozerMode(false);
                              setBuildType('commercial');
                              setSelectedItem(null);
                              entityManager.soundManager.playSound('fx_uiclick', false);
                            }}
                            title="Commercial"
                          />
                          <div
                            className={`selector ${buildType === 'commercial' ? 'selected' : ''}`}
                          ></div>
                        </div>
                      </div>
                      <div className="divider-h"></div>
                      <div className="hover">
                        <div className="flex-column">
                          <img
                            src="./images/zone-industrial.png"
                            onClick={() => {
                              setBulldozerMode(false);
                              setBuildType('industrial');
                              setSelectedItem(null);
                              entityManager.soundManager.playSound('fx_uiclick', false);
                            }}
                            title="Industrial"
                          />
                          <div
                            className={`selector ${buildType === 'industrial' ? 'selected' : ''}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="divider-h"></div>
                  <div className="hover">
                    <div className="flex-column">
                      <img
                        src="./images/utility.png"
                        onClick={() => {
                          setShowBuildingMenu(false);
                          showUtilityMenu ? setShowUtilityMenu(false) : setShowUtilityMenu(true);
                          setBuildType(null);
                          setBulldozerMode(false);
                          setSelectedItem(null);
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className="selector"></div>
                    </div>
                  </div>
                  <div className={`building-sub-menu ${showUtilityMenu ? 'active' : ''}`}>
                    <div className="flex">
                      <div className="divider-h"></div>
                      <div className="hover cost-block-margin">
                        <div className="flex-column pos-relative">
                          <img
                            src="./images/electricity.png"
                            onClick={() => {
                              setBulldozerMode(false);
                              setBuildType('power');
                              setSelectedItem(null);
                              entityManager.soundManager.playSound('fx_uiclick', false);
                            }}
                            title="Power"
                          />
                          <div className="text-center small pos-absolute top-2 right-0">£20</div>
                          <div
                            className={`selector ${buildType === 'power' ? 'selected' : ''}`}
                          ></div>
                        </div>
                      </div>
                      <div className="divider-h"></div>
                      <div className="hover cost-block-margin ">
                        <div className="flex-column pos-relative">
                          <img
                            src="./images/water.png"
                            onClick={() => {
                              setBulldozerMode(false);
                              setBuildType('water');
                              setSelectedItem(null);
                              entityManager.soundManager.playSound('fx_uiclick', false);
                            }}
                            title="Water"
                          />
                          <div className="text-center small pos-absolute top-2 right-0">£20</div>
                          <div
                            className={`selector ${buildType === 'water' ? 'selected' : ''}`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="divider-h"></div>
                  <div className="hover">
                    <div className="flex-column pos-relative">
                      <img
                        src="./images/bulldozer.png"
                        onClick={() => {
                          setBulldozerMode(true);
                          setBuildType(null);
                          setShowBuildingMenu(false);
                          setSelectedItem(null);
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className={`selector ${bulldozerMode ? 'selected' : ''}`}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex">
                  <div className="hover">
                    <div className="flex-column pos-relative">
                      <img
                        src="./images/cog.png"
                        onClick={() => {
                          setShowSettings(true);
                          setSelectedItem(null);
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className={`selector`}></div>
                    </div>
                  </div>
                  <div className="divider-h"></div>
                  <div className="hover">
                    <div className="flex-column pos-relative">
                      <img
                        src="./images/save.png"
                        onClick={() => {
                          entityManager.SaveGame();
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className={`selector`}></div>
                    </div>
                  </div>
                  <div className="divider-h"></div>
                  <div className="hover">
                    <div className="flex-column pos-relative">
                      <img
                        src="./images/load.png"
                        onClick={() => {
                          setLoad(true);
                          setStart(false);
                          entityManager.soundManager.playSound('fx_uiclick', false);
                        }}
                      />
                      <div className={`selector`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-4 text-right">
            <div className="pr-4">
              <div className="flex">
                <div className="col-4">
                  <p className="pb-h pt-h c-primary">Population: {entityManager?.people.length}</p>
                </div>
                <div className="col-4">
                  <p className="pb-h pt-h c-primary">
                    Funds: £{entityManager?.gameFunds.toFixed(2)}
                  </p>
                  <p className="c-primary">Tax Rate: {entityManager?.taxRate}%</p>
                </div>
                <div className="col-4">
                  <p className="pb-h pt-h c-primary">
                    Clock:{' '}
                    {`${clockH < 10 ? '0' + clockH.toFixed(0) : clockH.toFixed(0)}:${
                      clockM.toFixed(0) < 10 ? '0' + clockM.toFixed(0) : clockM.toFixed(0)
                    }`}
                  </p>
                  <p className="c-primary">Day: {entityManager?.days}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showSettings && <div className="bg-transparent"></div>}
      {showSettings && (
        <div
          className={`glassmorphism infoPanel br-r-8 p-h c-primary pos-absolute abs-centered width-600`}
        >
          <div className="header">
            <h3 className="mt-h mb-h">Settings</h3>
            <span
              className="topright cursor-pointer px-h py-h"
              onClick={() => setShowSettings(false)}
            >
              ×
            </span>
          </div>
          <table>
            <tbody>
              <tr>
                <td>Background Music</td>
                <td className="text-align-right">
                  <input
                    type="range"
                    id="volume"
                    name="volume"
                    min="0"
                    max="1"
                    step="0.1"
                    value={bgAudioLevel}
                    onChange={(e) => {
                      changeBgMusicVolume(event.target.value);
                      setBgAudioLevel(event.target.value);
                    }}
                  />
                  <label htmlFor="volume" className="mr-1">
                    Volume
                  </label>
                  <button
                    className="button"
                    onClick={() => {
                      muteBgAudioSet();
                    }}
                  >
                    {muteBgAudio === true ? 'UnMute' : 'Mute'}
                  </button>
                </td>
              </tr>
              <tr>
                <td>Sound Effects</td>
                <td className="text-align-right">
                  <input
                    type="range"
                    id="volume"
                    name="volume"
                    min="0"
                    max="1"
                    step="0.1"
                    value={fxAudioLevel}
                    onChange={(e) => {
                      changeFxMusicVolume(event.target.value);
                      setFxAudioLevel(event.target.value);
                    }}
                  />
                  <label htmlFor="volume" className="mr-1">
                    Volume
                  </label>
                  <button className="button" onClick={() => muteFxAudioSet()}>
                    {muteFxAudio === true ? 'UnMute' : 'Mute'}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default GUI;
