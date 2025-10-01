// Copyright 2019-2025, University of Colorado Boulder

/**
 * Explore2DVectorToolbox is a specialization of VectorToolbox for the 'Explore 2D' screen.
 *
 * @author Brandon Li
 */

import { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from '../../common/view/VectorToolbox.js';
import VectorToolboxSlot from '../../common/view/VectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import Explore2DScene from '../model/Explore2DScene.js';
import Explore2DVectorToolboxSlot from './Explore2DVectorToolboxSlot.js';

type SelfOptions = EmptySelfOptions;

type Explore2DVectorToolboxOptions = SelfOptions & VectorToolboxOptions;

export default class Explore2DVectorToolbox extends VectorToolbox {

  public constructor( scene: Explore2DScene,
                      sceneNode: VectorAdditionSceneNode,
                      providedOptions: Explore2DVectorToolboxOptions ) {

    const options = providedOptions;

    // Create a slot for each symbol
    const panelSlots: VectorToolboxSlot[] = [];
    scene.vectors.forEach( vector => {
      panelSlots.push( new Explore2DVectorToolboxSlot( vector, scene, scene.vectorSet, sceneNode,
        options.tandem.createTandem( `${vector.tandemNameSymbol}Slot` ) ) );
    } );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'Explore2DVectorToolbox', Explore2DVectorToolbox );