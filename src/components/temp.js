Update(delta, clockH, clockM) {
  if (this.moving === false) {
    // if we are at home we can either be sleeping, ready to go to work or ready to go to a shop
    // we initially spawn without a job so if we dont have one then we need to check for one
    if (this.job === null) {
      this.GetAJob();
    } else {
      if (this.parent.clockUpdate === true) {
        let jobObj = this.parent.getEntity(this.job);
        let destination = 'work';
        this.spawnBuilding = this.homeBuilding;
        this.targetLocation = destination;
        this.GetSpawnPoint(destination);
        let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
        if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
          this.CreatePathBetween();
          this.visible = true;
          this.moving = true;
          this.parent.requiresUpdate = true;
        }
      }
      // if (this.parent.clockUpdate === true) {
      //   // we have a job so we need to check if we are at work or shop or home and if we need to move
      //   // to a new destination.
      //   if (this.sleepEndH <= clockH && this.sleepEndM <= clockM) {
      //     // we should be awake
      //     this.sleeping = false;
      //     this.moving = false;
      //     this.parent.requiresUpdate = true;
      //     if (this.sleepStartH <= clockH && this.sleepStartM <= clockM) {
      //       // we should be back asleep!
      //       this.sleeping = true;
      //       this.visible = false;
      //       this.moving = false;
      //       this.parent.requiresUpdate = true;
      //     } else {
      //       if (this.sleepStartH - 1 === clockH && this.sleepStartM === clockM) {
      //         // we are an hour before sleep so no matter where we are we need to set target to go home.
      //         if (this.currentLocation !== 'home') {
      //           let destination = 'home';
      //           this.targetLocation = destination;
      //           this.GetSpawnPoint(destination);
      //           let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
      //           if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
      //             this.CreatePathBetween();
      //             this.visible = true;
      //             this.moving = true;
      //             this.parent.requiresUpdate = true;
      //           }
      //         }
      //       } else {
      //         let jobObj = this.parent.getEntity(this.job);
      //         // we are during normal daytime hours
      //         if (clockH === this.sleepEndH && Math.floor(clockM) === this.setOffForWorkM) {
      //           // we are in the hour before work so we need to set off to work
      //           let destination = 'work';
      //           this.spawnBuilding = this.homeBuilding;
      //           this.targetLocation = destination;
      //           this.GetSpawnPoint(destination);
      //           let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
      //           if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
      //             this.CreatePathBetween();
      //             this.visible = true;
      //             this.moving = true;
      //             this.parent.requiresUpdate = true;
      //           }
      //         } else if (
      //           clockH < jobObj.levelData.shift_endH &&
      //           Math.floor(clockM) < jobObj.levelData.shift_endM
      //         ) {
      //           // we are at work!
      //         } else if (
      //           jobObj.levelData.shift_endH === clockH &&
      //           jobObj.levelData.shift_endM === Math.round(clockM)
      //         ) {
      //           let jobWage = jobObj.levelData.wage / 7;
      //           jobWage = jobWage.toFixed(2);
      //           let tax = (jobWage / 100) * this.parent.taxRate;
      //           this.parent.gameFunds = this.parent.gameFunds + tax;
      //           let personWage = jobWage - tax;
      //           personWage = personWage.toFixed(2);
      //           let newFund = parseFloat(this.funds) + parseFloat(personWage);
      //           this.funds = newFund.toFixed(2);
      //           let newJobFunds = jobObj.current_funds - jobWage;
      //           jobObj.current_funds = newJobFunds.toFixed(2);
      //           this.parent.soundManager.playSound('fx_cashregister', false);
      //           // console.log(`sim ${this.id} was paid ${personWage} at ${this.job.id}`);
      //         } else {
      //           if (
      //             clockH >= jobObj.levelData.shift_endH &&
      //             Math.floor(clockM) >= jobObj.levelData.shift_endM
      //           ) {
      //             // we are now outside of set off to work time  and outside of work hours
      //             let destination = 'home';
      //             if (this.currentLocation === 'home') {
      //               // for now we will just random between work and other
      //               destination = 'other';
      //             } else if (this.currentLocation === 'work') {
      //               destination = 'home';
      //               if (Math.random() < 0.5) {
      //                 destination = 'other';
      //               }
      //             } else if (this.currentLocation === 'other') {
      //               destination = 'home';
      //             }
      //             this.targetLocation = destination;
      //             this.GetSpawnPoint(destination);
      //             let spawnPointRoadObj = this.parent.getEntity(this.spawnPointRoad);
      //             if (typeof spawnPointRoadObj !== 'undefined' && spawnPointRoadObj !== null) {
      //               this.CreatePathBetween();
      //               this.visible = true;
      //               this.moving = true;
      //               this.parent.requiresUpdate = true;
      //             }
      //           }
      //         }
      //       }
      //     }
      //   } else {
      //     // we dont move when sleeping
      //     if (this.sleeping === false) {
      //       this.sleeping = true;
      //       this.visible = false;
      //       this.moving = false;
      //       this.parent.requiresUpdate = true;
      //     }
      //   }
      // }
    }
  } else {
    if (this.agentPath !== null && typeof this.agentPath !== 'undefined') {
      if (this.agentPath.length > 0) {
        let targetPosition = this.agentPath[0];
        targetPosition.y = 0.025;
        const distance = targetPosition.clone().sub(this.position);
        if (distance.lengthSq() > 0.001) {
          distance.normalize();
          distance.multiplyScalar(delta * this.speed);
          this.position.add(distance);
          let directionVector = this.position.clone().sub(targetPosition);
          directionVector.normalize();
          directionVector.multiplyScalar(delta * this.speed);
          const m = new THREE.Matrix4();
          this.direction.lookAt(
            new THREE.Vector3(0, 0, 0),
            directionVector,
            new THREE.Vector3(0, 1, 0),
          );
        } else {
          this.agentPath.shift();
          if (this.agentPath.length === 0 && this.endMovement === false) {
            // if (this.targetBuilding === this.job) {
            //   // TODO shift this to be at the end of the work day
            // } else if (this.targetBuilding === this.homeBuilding) {
            //   // do nothing for now
            // } else {
            //   // its a shop so spend some money
            //   let targetBuildingObj = this.parent.getEntity(this.targetBuilding);
            //   if (targetBuildingObj.stock >= 5) {
            //     let cost = targetBuildingObj.levelData.average_spend.toFixed(2);
            //     let tax = (cost / 100) * this.parent.taxRate;
            //     this.parent.gameFunds += tax;
            //     let itemsCost = cost - tax;
            //     itemsCost = itemsCost.toFixed(2);
            //     this.funds -= targetBuildingObj.levelData.average_spend.toFixed(2);
            //     let newFunds =
            //       parseFloat(targetBuildingObj.current_funds) + parseFloat(itemsCost);
            //     targetBuildingObj.current_fund = newFunds.toFixed(2);
            //     targetBuildingObj.stock -= 5;
            //     this.parent.soundManager.playSound('fx_cashregister', false);
            //     // console.log(
            //     //   `sim ${this.id} spent ${this.targetBuilding.levelData.average_spend.toFixed(
            //     //     2,
            //     //   )} at ${this.targetBuilding.id}`,
            //     // );
            //   } else {
            //     // console.log(
            //     //   `sim ${this.id} arrived at ${this.targetBuilding.id} but there is no stock`,
            //     // );
            //   }
            // }
            // this.spawnBuilding = this.targetBuilding;
            // this.currentLocation = this.targetLocation;
            // this.endMovement = true;
            // this.visible = false;
            // this.moving = false;
            // this.parent.requiresUpdate = true;
          }
        }
      } else {
        // if (this.targetBuilding === this.job) {
        //   // take a wage
        // } else if (this.targetBuilding === this.homeBuilding) {
        //   // do nothing for now
        // } else {
        //   // its a shop so spend some money
        //   let targetBuildingObj = this.parent.getEntity(this.targetBuilding);
        //   if (targetBuildingObj.stock >= 5) {
        //     let cost = targetBuildingObj.levelData.average_spend.toFixed(2);
        //     let tax = (cost / 100) * this.parent.taxRate;
        //     let itemsCost = cost - tax;
        //     this.parent.gameFunds += tax;
        //     itemsCost = itemsCost.toFixed(2);
        //     this.funds -= targetBuildingObj.levelData.average_spend.toFixed(2);
        //     let newFunds = parseFloat(targetBuildingObj.current_funds) + parseFloat(itemsCost);
        //     targetBuildingObj.current_fund = newFunds.toFixed(2);
        //     targetBuildingObj.stock -= 5;
        //     this.parent.soundManager.playSound('fx_cashregister', false);
        //     this.parent.requiresUpdate = true;
        //     // console.log(
        //     //   `sim ${this.id} spent ${this.targetBuilding.levelData.average_spend.toFixed(
        //     //     2,
        //     //   )} at ${this.targetBuilding.id}`,
        //     // );
        //   } else {
        //     // console.log(
        //     //   `sim ${this.id} arrived at ${this.targetBuilding.id} but there is no stock`,
        //     // );
        //   }
        // }
        // this.spawnBuilding = this.targetBuilding;
        // this.currentLocation = this.targetLocation;
        // this.endMovement = true;
        // this.visible = false;
        // this.moving = false;
        // this.parent.requiresUpdate = true;
      }
    }
  }
  return null;
}