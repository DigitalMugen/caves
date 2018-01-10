export default [
  {
    id: 1, name: 'an old diary', tag: 'diary',
    state: {
      room: 1
    },
    actions: {
      read: (output, command, location, object, game, player, locations, objects) => {
        output.print(`It reads:`, 'story');
        output.print(`Add sodium chloride plus the formula to rainwater to reach the`, 'story');
        output.print(`other world.`, 'story');
      }
    }
  },
  {
    id: 2, name: 'a small box', tag: 'box',
    identity: {
      isOpenable: true
    },
    state: {
      room: 1,
      isOpen: false,
      contents: [ 7 ]
    }
  },
  {
    id: 3, name: 'cabinet', tag: 'cabinet',
    identity: {
      isFixed: true,
      isOpenable: true
    },
    state: {
      room: 2,
      isOpen: false,
      contents: [ 4 ]
    }
  },
  {
    id: 4, name: 'a salt shaker', tag: 'salt',
    identity: {
      isPourable: true
    },
    actions: {
      pour: (output, command, location, object, game, player, locations, objects) => {
        if (object.state.isEmpty) return;
        output.print(`The cap on the shaker falls off, and all of the salt dumps out!`, 'story');
        let objectChanges = {
          4: { isEmpty: true }
        };
        const barrel = objects.getItem(6);
        if (barrel.state.room === location.id) objectChanges[6] = { containsSalt: true };
        return {
          objects: objectChanges
        }
      }
    }
  },
  {
    id: 5, name: 'a dictionary', tag: 'dictionary',
    identity: {
      writing: `Sodium chloride is common table salt.`
    },
    state: {
      room: 3
    }
  },
  {
    id: 6, name: 'wooden barrel', tag: 'barrel',
    identity: {
      isFixed: true,
      description: `It's filled with rainwater.`
    },
    state: {
      room: 4
    },
    reactions: {
      pour: (output, command, location, object, game, player, locations, objects) => {
        const barrel = objects.getItem(6);
        if (barrel.state.containsSalt && barrel.state.containsFormula) {
          output.print(`There's an explosion!`, 'story');
          output.print(`Everything goes white!  When you come to, you are...`, 'story');
          output.print(`...somewhere else.`, 'story');
          return {
            player: { room: 6 }
          };
        }
      }
    }
  },
  {
    id: 7, name: 'a small bottle', tag: 'bottle',
    identity: {
      isPourable: true,
      description: `There's something written on it.`,
      writing: `Secret formula`
    },
    actions: {
      pour: (output, command, location, object, game, player, locations, objects) => {
        if (object.state.isEmpty) return;
        output.print(`Although the red substance looks liquid, it comes out of the`, 'story');
        output.print(`bottle in one blob.`, 'story');
        let objectChanges = {
          7: { isEmpty: true }
        };
        const barrel = objects.getItem(6);
        if (barrel.state.room === location.id) objectChanges[6] = { containsFormula: true };
        return {
          objects: objectChanges
        }
      }
    }
  },
  {
    id: 8, name: 'a ladder', tag: 'ladder',
    state: {
      room: 5
    }
  },
  {
    id: 9, name: 'a shovel', tag: 'shovel',
    identity: {
      isDiggingTool: true
    },
    state: {
      room: 5
    }
  },
  {
    id: 10, name: 'a tree', tag: 'tree',
    identity: {
      isFixed: true
    },
    state: {
      room: 7
    },
    actions: {
      climb: (output, command, location, object, game, player, locations, objects) => {
        output.print(`You cannot quite reach the branches.`, 'story');
        return { abort: true };
      }
    },
    reactions: {
      jump: (output, command, location, object, game, player, locations, objects) => {
        output.print(`You grab onto a bottom limb of the tree, and pull yourself up.`, 'story');
        return {
          player: { room: 8 }
        }
      }
    }
  },
  {
    id: 11, name: 'a golden sword', tag: 'sword',
    identity: {
      isWeapon: true
    }
  },
  {
    id: 12, name: 'a wooden boat', tag: 'boat',
    identity: {
      isFixed: true
    },
    state: {
      room: 12,
      isEnterable: true,
      enterDestination: 13,
      enterTransition: 'You climb into the boat.'
    }
  },
  {
    id: 13, name: 'a magic fan', tag: 'fan',
    state: {
      room: 8
    },
    reactions: {
      wave: (output, command, location, object, game, player, locations, objects) => {
        output.print(`You feel a refreshing breeze.`, 'story');
      }
    }
  },
  {
    id: 14, name: 'a nasty-looking guard', tag: 'guard',
    identity: {
      isEnemy: true
    },
    state: {
      room: 16
    },
    reactions: {
      go: (output, command, location, game, player, locations, objects) => {
        if (command.object === 'north') {
          output.print(`The guard stops you!`, 'story');
          return {
            abort: true,
            player: {
              location: location.id
            }
          };
        }
      },
      fight: (output, command, location, game, player, locations, objects) => {
        output.print(`The guard, seeing your sword, retreats into the castle.`, 'story');
        return {
          objects: {
            14: { room: null }
          }
        };
      }
    }
  },
  {
    id: 15, name: 'a glass case', tag: 'case',
    identity: {
      isFixed: true,
      isOpenable: true
    },
    state: {
      room: 18,
      contents: [ 16 ]
    },
    actions: {
      open: (output, command, location, object, game, player, locations, objects) => {
        const wornObject = objects.getItem(player.state.wearing || 0);
        if (!wornObject || wornObject.tag !== 'gloves') {
          output.print(`The case is electrified!`, 'story');
          return { abort: true };
        } else {
          output.print(`The gloves insulate against the electricity!`, 'story');
        }
      }
    }
  },
  {
    id: 16, name: 'a glowing ruby', tag: 'ruby'
  },
  {
    id: 17, name: 'a pair of rubber gloves', tag: 'gloves',
    identity: {
      isWearable: true
    },
    state: {
      room: 19
    }
  }
]