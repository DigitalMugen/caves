/**
 * Caves Engine: Game Player Entity
 * @copyright Bill Robitske, Jr. 2018
 * @author    Bill Robitske, Jr. <bill.robitske.jr@gmail.com>
 * @license   MIT
 */

import Entity from './entity.js';
import Command from './command.js';
import Action from './action.js';
import LocationEntity from './location-entity.js';
import ObjectEntity from './object-entity.js';

/**
 * Player entity class
 */
export default class PlayerEntity extends Entity {

  /**
   * Create a new player entity
   * @param {Object} config - Player entity configuration
   * @param {GameEntity} game - Current game entity
   */
  constructor(config, game) {
    super(config);
    this._game = game;
    this.setState('inventory', []);
    this.setState('maxCarry', config.maxCarry || 0);
    this.setState('location', config.location || 1);
    this._actions = ACTIONS.concat(config.actions || []).map(action => new Action(action));
  }

  /**
   * @property {ObjectEntity[]} inventory - This entity's currently held objects
   * @readonly
   */
  get inventory() { return this.getState('inventory').map(id => this._game.objects.getByID(id)); }

  /**
   * Add an object to this player's inventory
   * @param {ObjectEntity} object - Object to be added
   */
  addObjectToInventory(object) {
    if (!(object instanceof ObjectEntity)) throw new TypeError(`Object to be added must be an instance of ObjectEntity.`);
    const inventory = this.getState('inventory');
    if (inventory.indexOf(object.id) !== -1) return;
    inventory.push(object.id);
    this.setState('inventory', inventory);
  }

  /**
   * Remove an object from this player's inventory
   * @param {ObjectEntity} object - Object to be removed
   */
  removeObjectFromInventory(object) {
    if (!(object instanceof ObjectEntity)) throw new TypeError(`Object to be removed must be an instance of ObjectEntity.`);
    const inventory = this.getState('inventory');
    const index = inventory.indexOf(object.id);
    if (index === -1) return;
    inventory.splice(index, 1);
    this.setState('inventory', inventory);
  }

  /**
   * @property {number} maxCarry - Maximum number of objects this player can carry
   * @readonly
   */
  get maxCarry() { return this.getState('maxCarry'); }

  /**
   * @property {LocationEntity} location - This player's current location
   */
  get location() { return this._game.locations.getByID(this.getState('location')); }
  set location(value) {
    if (!(value instanceof LocationEntity)) throw new TypeError(`Value is not an instance of LocationEntity.`);
    this.setState('location', value.id);
  }

  /**
   * Perform a command
   * @param {Command} command - Command to attempt to perform
   * @returns {string[]} - Lines of output to display
   */
  perform(command) {
    if (!(command instanceof Command)) return;
    const action = this.getAction(command.verb);
    if (!action) return [ `You don't know how to do that!` ];
    const { stop, output } = action.start(this, command, this._game);
    if (stop) return output || [];
    const completeOutput = action.complete(this, command, this._game);
    return [].concat(output, completeOutput);
  }

  /**
   * Get this player's action associated with a verb, if any
   * @param {string} verb - Verb to get an action for
   * @return {?Action} - Action associated with this verb
   */
  getAction(verb) {
    return this._actions.find(action => action.verbTest.test(verb)) || null;
  }
}

/**
 * Built-in/engine-defined player actions
 * @type {Object[]}
 * @private
 * @readonly
 */
const ACTIONS = [
  {
    verbs: ['go'],
    start: (actor, command, game) => {
      const direction = command.nounPhrase;
      const exit = actor.location.exits.find(exit => exit.direction === direction);
      if (exit) {
        return { output: [ exit.transition || `You head ${direction}...`] };
      } else {
        return { stop: true, output: [`You can't go that way!`] };
      }
    },
    complete: (actor, command, game) => {
      const direction = command.nounPhrase;
      const exit = actor.location.exits.find(exit => exit.direction === direction);
      const destination = game.locations.getByID(exit.destination);
      actor.location = destination;
      return [`You are ${destination.name}.`];
    }
  },
  {
    verbs: ['get', 'take'],
    start: (actor, command, game) => {
      if (!command.nounPhrase) return { stop: true, output: [`What do you want to get?`] };
      if (!command.nounObject) return { stop: true, output: [`You can't ${command.verb} that.`] };
      if (actor.inventory.indexOf(command.nounObject) !== -1) return { stop: true, output: [`You already have ${command.nounObject.name}.`] };
      if (command.nounObject.location !== actor.location) return { stop: true, output: [`It's not here.`] };
      return {};
    },
    complete: (actor, command, game) => {
      actor.addObjectToInventory(command.nounObject);
      command.nounObject.location = null;
      return [`You pick up ${command.nounObject.name}.`];
    }
  },
  {
    verbs: ['drop'],
    start: (actor, command, game) => {
      if (!command.nounPhrase) return { stop: true, output: [`What do you want to drop?`] };
      if (!command.nounObject) return { stop: true, output: [`You can't drop that.`] };
      if (actor.inventory.indexOf(command.nounObject) === -1) return { stop: true, output: [`You don't have that.`] };
      return {};
    },
    complete: (actor, command, game) => {
      actor.removeObjectFromInventory(command.nounObject);
      command.nounObject.location = actor.location;
      return [`You drop ${command.nounObject.name}.`];
    }
  },
  {
    verbs: ['examine', 'inspect'],
    start: (actor, command, game) => {
      if (!command.nounPhrase) return { stop: true, output: [`What do you want to ${command.verb}?`] };
      if (!command.nounObject) return { stop: true, output: [`You can't ${command.verb} that.`] };
      if (actor.location !== command.nounObject.location && actor.inventory.indexOf(command.nounObject) === -1) return { stop: true, output: [`It's not here.`] };
      return {};
    },
    complete: (actor, command, game) => {
      const output = [];
      output.push(`You examine ${command.nounObject.name}.`);
      const description = command.nounObject.description;
      output.push(description || `You see nothing unusual.`);
      return output;
    }
  }
];
