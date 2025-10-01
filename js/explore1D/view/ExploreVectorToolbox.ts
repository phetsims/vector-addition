// Copyright 2019-2025, University of Colorado Boulder

/**
 * ExploreVectorToolbox is a specialization of VectorToolbox for the 'Explore 1D' and 'Explore 2D' screens.
 *
 * @author Brandon Li
 */

import optionize from '../../../../phet-core/js/optionize.js';
import VectorAdditionSceneNode from '../../common/view/VectorAdditionSceneNode.js';
import VectorToolbox, { VectorToolboxOptions } from '../../common/view/VectorToolbox.js';
import VectorToolboxSlot from '../../common/view/VectorToolboxSlot.js';
import vectorAddition from '../../vectorAddition.js';
import Explore1DScene from '../model/Explore1DScene.js';
import ExploreVectorToolboxSlot from './ExploreVectorToolboxSlot.js';
import Vector2 from '../../../../dot/js/Vector2.js';

type SelfOptions = {
  iconVectorComponents?: Vector2 | null;
};

type Explore1DVectorToolboxOptions = SelfOptions & VectorToolboxOptions;

export default class ExploreVectorToolbox extends VectorToolbox {

  public constructor( scene: Explore1DScene,
                      sceneNode: VectorAdditionSceneNode,
                      providedOptions: Explore1DVectorToolboxOptions ) {

    const options = optionize<Explore1DVectorToolboxOptions, SelfOptions, VectorToolboxOptions>()( {

      // SelfOptions
      iconVectorComponents: null
    }, providedOptions );

    // Create a slot for each vector.
    const panelSlots: VectorToolboxSlot[] = [];
    scene.vectors.forEach( vector => {
      panelSlots.push( new ExploreVectorToolboxSlot( vector, scene, scene.vectorSet, sceneNode,
        options.iconVectorComponents, options.tandem.createTandem( `${vector.tandemNameSymbol}Slot` ) ) );
    } );

    super( panelSlots, options );
  }
}

vectorAddition.register( 'ExploreVectorToolbox', ExploreVectorToolbox );