export default [
  {
    id: 1, name: 'an old diary', tag: 'diary',
    state: {
      room: 1
    }
  },
  {
    id: 2, name: 'a small box', tag: 'box',
    state: {
      room: 1
    }
  },
  {
    id: 3, name: 'cabinet', tag: 'cabinet',
    identity: {
      isFixed: true
    },
    state: {
      room: 2
    }
  },
  {
    id: 4, name: 'a salt shaker', tag: 'salt',
  },
  {
    id: 5, name: 'a dictionary', tag: 'dictionary',
    state: {
      room: 3
    }
  },
  {
    id: 6, name: 'wooden barrel', tag: 'barrel',
    identity: {
      isFixed: true
    },
    state: {
      room: 4
    }
  },
  {
    id: 7, name: 'a small bottle', tag: 'bottle'
  },
  {
    id: 8, name: 'a ladder', tag: 'ladder',
    state: {
      room: 5
    }
  },
  {
    id: 9, name: 'a shovel', tag: 'shovel',
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
    id: 11, name: 'a golden sword', tag: 'sword'
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
      }
    }
  },
  {
    id: 15, name: 'a glass case', tag: 'case',
    identity: {
      isFixed: true
    },
    state: {
      room: 18
    }
  },
  {
    id: 16, name: 'a glowing ruby', tag: 'ruby'
  },
  {
    id: 17, name: 'a pair of rubber gloves', tag: 'gloves',
    state: {
      room: 19
    }
  }
]